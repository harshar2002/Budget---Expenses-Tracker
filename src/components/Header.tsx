"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        BudgetTracker
                    </span>
                </div>

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {mounted && theme === "dark" ? (
                        <Sun className="h-5 w-5 text-slate-300" />
                    ) : (
                        <Moon className="h-5 w-5 text-slate-700" />
                    )}
                </button>
            </div>
        </header>
    );
}
