import { useState, useEffect } from 'react';

export function useBudget() {
    const [targetBudget, setTargetBudget] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem('monthlyBudget');
        if (stored) {
            try {
                setTargetBudget(Number(stored));
            } catch (error) {
                console.error('Failed to parse budget', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever budget changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('monthlyBudget', targetBudget.toString());
        }
    }, [targetBudget, isLoaded]);

    const setBudget = (amount: number) => {
        setTargetBudget(amount);
    };

    return {
        targetBudget,
        isLoaded,
        setBudget,
    };
}
