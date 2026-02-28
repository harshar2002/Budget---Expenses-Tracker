"use client";

import { useState, useMemo } from "react";
import { Plus, Edit2, Check } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudget } from "@/hooks/useBudget";
import { useCategories } from "@/hooks/useCategories";
import { Header } from "@/components/Header";
import { DashboardCards } from "@/components/DashboardCards";
import { Charts } from "@/components/Charts";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseForm } from "@/components/ExpenseForm";
import { CategoryManager } from "@/components/CategoryManager";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Tag } from "lucide-react";

export default function Dashboard() {
  const { expenses, isLoaded: expensesLoaded, addExpense, deleteExpense, clearAll } = useExpenses();
  const { targetBudget, isLoaded: budgetLoaded, setBudget } = useBudget();
  const { categories, isLoaded: categoriesLoaded, addCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // Budget Input State
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("");

  const handleSaveBudget = () => {
    const val = Number(tempBudget);
    if (!isNaN(val) && val >= 0) {
      setBudget(val);
    }
    setIsEditingBudget(false);
  };

  // derived metrics for current month
  const metrics = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // total spent this month
    const currentMonthExpenses = expenses.filter((e) => {
      try {
        const date = parseISO(e.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      } catch {
        return false;
      }
    });

    const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Days in current month elapsed so far
    const daysElapsed = Math.max(1, now.getDate());
    const dailyAvg = totalExpense / daysElapsed;

    return {
      totalExpense,
      dailyAvg,
    };
  }, [expenses]);

  if (!expensesLoaded || !budgetLoaded || !categoriesLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-4 text-slate-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {format(new Date(), "MMMM yyyy")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Set Budget Inline */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 sm:flex-none">
              {isEditingBudget ? (
                <div className="flex items-center gap-1 w-full">
                  <span className="pl-2 text-slate-500">₹</span>
                  <input
                    type="number"
                    autoFocus
                    className="w-24 bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 font-medium"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveBudget()}
                    placeholder="Budget"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className="p-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-1 w-full justify-between sm:justify-start">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">Monthly Target</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      ₹{targetBudget > 0 ? targetBudget.toLocaleString() : "0"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setTempBudget(targetBudget.toString());
                      setIsEditingBudget(true);
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    title="Edit monthly budget"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl font-medium transition-all shadow-sm hover:shadow-md w-full sm:w-auto"
                title="Manage Categories"
              >
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm shadow-indigo-200 dark:shadow-none hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Component */}
        <DashboardCards
          totalExpense={metrics.totalExpense}
          targetBudget={targetBudget}
          dailyAvg={metrics.dailyAvg}
        />

        {/* Charts Component */}
        <Charts expenses={expenses} />

        {/* Expense List Component */}
        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          onClearAll={clearAll}
        />

      </main>

      {/* Expense Modal */}
      <ExpenseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addExpense}
        categories={categories}
      />

      {/* Category Manager Modal */}
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAdd={addCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
