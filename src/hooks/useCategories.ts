import { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
    'Food',
    'Transport',
    'Personal',
    'Shopping',
    'Recharge',
    'Emergency',
    'Others',
];

export function useCategories() {
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('categories');
        if (stored) {
            try {
                setCategories(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse categories', error);
                setCategories(DEFAULT_CATEGORIES);
            }
        } else {
            setCategories(DEFAULT_CATEGORIES);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('categories', JSON.stringify(categories));
        }
    }, [categories, isLoaded]);

    const addCategory = (category: string) => {
        const trimmed = category.trim();
        if (trimmed && !categories.includes(trimmed)) {
            setCategories((prev) => [...prev, trimmed]);
        }
    };

    const deleteCategory = (category: string) => {
        setCategories((prev) => prev.filter((c) => c !== category));
    };

    return {
        categories,
        isLoaded,
        addCategory,
        deleteCategory,
    };
}
