"use client";

import React, { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Download, Trash2, Calendar, FileX2 } from "lucide-react";
import { Expense } from "@/types";

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
    onClearAll: () => void;
}

export function ExpenseList({ expenses, onDelete, onClearAll }: ExpenseListProps) {
    const [selectedMonth, setSelectedMonth] = useState<string>("All");

    // Get unique months for filter dropdown
    const months = useMemo(() => {
        const uniqueMonths = new Set<string>();
        expenses.forEach((e) => {
            uniqueMonths.add(format(parseISO(e.date), "yyyy-MM"));
        });
        return ["All", ...Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a))];
    }, [expenses]);

    // Filter expenses based on selected month, sort by date desc
    const filteredExpenses = useMemo(() => {
        let filtered = expenses;
        if (selectedMonth !== "All") {
            filtered = expenses.filter(
                (e) => format(parseISO(e.date), "yyyy-MM") === selectedMonth
            );
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses, selectedMonth]);

    // Group expenses by day
    const groupedExpenses = useMemo(() => {
        const groups: Record<string, Expense[]> = {};
        filteredExpenses.forEach(exp => {
            const day = format(parseISO(exp.date), "yyyy-MM-dd");
            if (!groups[day]) groups[day] = [];
            groups[day].push(exp);
        });

        return Object.keys(groups)
            .sort((a, b) => b.localeCompare(a))
            .map(day => ({
                day,
                expenses: groups[day]
            }));
    }, [filteredExpenses]);

    const handleExportCSV = () => {
        if (filteredExpenses.length === 0) return;

        const headers = ["Date", "Description", "Category", "Amount"];
        const csvContent = [
            headers.join(","),
            ...filteredExpenses.map((e) =>
                `"${e.date}","${e.description.replace(/"/g, '""')}","${e.category}",${e.amount}`
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `expenses_${selectedMonth !== "All" ? selectedMonth : "all"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Recent Expenses
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-700 dark:text-slate-300 transition-shadow"
                        >
                            {months.map((m) => (
                                <option key={m} value={m}>
                                    {m === "All" ? "All Months" : format(parseISO(`${m}-01`), "MMMM yyyy")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleExportCSV}
                        disabled={filteredExpenses.length === 0}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Export to CSV"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                                onClearAll();
                            }
                        }}
                        disabled={expenses.length === 0}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear All</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                {filteredExpenses.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {groupedExpenses.map(({ day, expenses }) => (
                                <React.Fragment key={day}>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800/50">
                                        <td colSpan={5} className="px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            {format(parseISO(day), "MMMM dd, yyyy")}
                                            <span className="float-right text-indigo-600 dark:text-indigo-400">
                                                ₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                    </tr>
                                    {expenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {format(parseISO(expense.date), "hh:mm a")}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 font-medium">
                                                {expense.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-400/20">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 font-bold text-right">
                                                ₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => onDelete(expense.id)}
                                                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                                    title="Delete Expense"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <FileX2 className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No expenses found for the selected period.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
