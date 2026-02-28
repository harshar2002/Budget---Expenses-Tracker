"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, PlusCircle } from "lucide-react";
import { Category, Expense } from "@/types";

interface ExpenseFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (expense: Expense) => void;
    categories: string[];
}

export function ExpenseForm({ isOpen, onClose, onAdd, categories }: ExpenseFormProps) {
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<Category>(categories[0] || "Food");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

    // Reset form when opened
    useEffect(() => {
        if (isOpen) {
            setAmount("");
            setDescription("");
            setCategory(categories[0] || "Food");
            setDate(format(new Date(), "yyyy-MM-dd"));
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;

        // Synchronize exactly to the current time, but keep the user's selected date
        const now = new Date();
        const dateParts = date.split('-').map(Number);

        let finalDate;
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts;
            finalDate = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());
        } else {
            finalDate = new Date();
        }

        const newExpense: Expense = {
            id: crypto.randomUUID(),
            amount: Number(amount),
            description,
            category,
            date: finalDate.toISOString(),
        };

        onAdd(newExpense);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <PlusCircle className="h-5 w-5 text-indigo-500" />
                        Add Expense
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Amount (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Description
                        </label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="What did you spend on?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                        >
                            Save Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
