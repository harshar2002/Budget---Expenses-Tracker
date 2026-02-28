import { useState, useEffect } from 'react';
import { Expense } from '@/types';

export function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem('expenses');
        if (stored) {
            try {
                setExpenses(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse expenses', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever expenses change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        }
    }, [expenses, isLoaded]);

    const addExpense = (expense: Expense) => {
        setExpenses((prev) => [...prev, expense]);
    };

    const deleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    };

    const updateExpense = (updated: Expense) => {
        setExpenses((prev) =>
            prev.map((e) => (e.id === updated.id ? updated : e))
        );
    };

    const clearAll = () => {
        setExpenses([]);
    };

    return {
        expenses,
        isLoaded,
        addExpense,
        deleteExpense,
        updateExpense,
        clearAll,
    };
}
