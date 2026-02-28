"use client";

import { CreditCard, TrendingDown, PiggyBank, CalendarClock, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface DashboardCardsProps {
    totalExpense: number;
    targetBudget: number;
    dailyAvg: number;
}

export function DashboardCards({ totalExpense, targetBudget, dailyAvg }: DashboardCardsProps) {
    const remaining = targetBudget - totalExpense;
    const isExceeded = remaining < 0;
    const usagePercentage = targetBudget > 0 ? (totalExpense / targetBudget) * 100 : 0;

    const cards = [
        {
            title: "Total Spent",
            value: `₹${totalExpense.toLocaleString()}`,
            subtitle: typeof usagePercentage === "number" ? `${usagePercentage.toFixed(1)}% of budget` : "No budget set",
            icon: TrendingDown,
            color: "text-rose-500 dark:text-rose-400",
            bgClass: "bg-rose-100 dark:bg-rose-500/20",
        },
        {
            title: "Remaining Budget",
            value: targetBudget > 0 ? `₹${remaining.toLocaleString()}` : "Not Set",
            subtitle: isExceeded ? "Budget exceeded!" : "Available to spend",
            icon: isExceeded ? AlertCircle : PiggyBank,
            color: isExceeded ? "text-rose-600 dark:text-rose-500" : "text-emerald-500 dark:text-emerald-400",
            bgClass: isExceeded ? "bg-rose-100 dark:bg-rose-500/20" : "bg-emerald-100 dark:bg-emerald-500/20",
        },
        {
            title: "Monthly Budget",
            value: `₹${targetBudget.toLocaleString()}`,
            subtitle: "Target for this month",
            icon: CreditCard,
            color: "text-indigo-500 dark:text-indigo-400",
            bgClass: "bg-indigo-100 dark:bg-indigo-500/20",
        },
        {
            title: "Daily Average",
            value: `₹${dailyAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            subtitle: "Based on days this month",
            icon: CalendarClock,
            color: "text-amber-500 dark:text-amber-400",
            bgClass: "bg-amber-100 dark:bg-amber-500/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={clsx(
                        "p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md",
                        card.title === "Remaining Budget" && isExceeded && "border-rose-200 dark:border-rose-900/50"
                    )}
                >
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-slate-500 dark:text-slate-400">
                            {card.title}
                        </h3>
                        <div className={clsx("p-2 rounded-lg", card.bgClass)}>
                            <card.icon className={clsx("h-4 w-4", card.color)} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <div className={clsx("text-2xl font-bold font-mono tracking-tight", card.title === "Remaining Budget" && isExceeded && "text-rose-600 dark:text-rose-500")}>
                            {card.value}
                        </div>
                        <p className={clsx("text-xs", card.title === "Remaining Budget" && isExceeded ? "text-rose-500 font-medium" : "text-slate-500 dark:text-slate-400")}>
                            {card.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
