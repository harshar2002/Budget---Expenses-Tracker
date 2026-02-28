"use client";

import { useState } from "react";
import { X, Plus, Trash2, Tag } from "lucide-react";

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    onAdd: (category: string) => void;
    onDelete: (category: string) => void;
}

export function CategoryManager({ isOpen, onClose, categories, onAdd, onDelete }: CategoryManagerProps) {
    const [newCategory, setNewCategory] = useState("");

    if (!isOpen) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newCategory.trim();
        if (trimmed && !categories.includes(trimmed)) {
            onAdd(trimmed);
            setNewCategory("");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]"
                role="dialog"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-indigo-500" />
                        Manage Categories
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category name..."
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-900 dark:text-slate-100"
                        />
                        <button
                            type="submit"
                            disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </form>
                </div>

                <div className="p-4 overflow-y-auto">
                    {categories.length === 0 ? (
                        <p className="text-center text-slate-500 py-4 text-sm">No categories found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                                    <button
                                        onClick={() => onDelete(cat)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                        title="Delete Category"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
