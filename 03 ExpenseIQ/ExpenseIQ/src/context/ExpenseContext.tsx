import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import NetInfo from '@react-native-community/netinfo';

import {
    QueueItem,
} from '../types/queue';

import {
    addToQueue,
    getPendingQueue,
    savePendingQueue,
} from '../storage/queueStorage';

import {
    createExpense,
    updateExpense,
    deleteExpense,
    is404Error,
} from '../services/api';
import { ExpenseFilters } from '../types/filter';

import { Expense } from '../types/expense';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getData, saveData } from '../storage/asyncStorage';

interface ExpenseContextType {
    expenses: Expense[];
    loading: boolean;
    error: string | null;

    setError: (value: string | null) => void;

    addExpense: (expense: Expense) => Promise<void>;

    updateExpenseById: (
        expenseId: string,
        updatedExpense: Expense,
    ) => Promise<void>;

    deleteExpenseById: (
        expenseId: string,
    ) => Promise<void>;

    getExpenseById: (
        expenseId: string,
    ) => Expense | undefined;

    refreshExpenses: () => Promise<void>;

    queueCount: number;
    syncing: boolean;
    syncNow: () => Promise<void>;

    filters: ExpenseFilters;

    setFilters: React.Dispatch<
        React.SetStateAction<ExpenseFilters>
    >;
}

const [queueCount, setQueueCount] = useState(0);
const [syncing, setSyncing] = useState(false);
const [filters, setFilters] =
    useState<ExpenseFilters>({
        categories: [],
        startDate: null,
        endDate: null,
        minAmount: '',
        maxAmount: '',
    });

const loadQueueCount =
    async () => {
        try {
            const queue =
                await getPendingQueue();

            setQueueCount(
                queue.length,
            );
        } catch (error) {
            console.log(error);
        }
    };

const ExpenseContext =
    createContext<ExpenseContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const ExpenseProvider = ({
    children,
}: Props) => {
    const [expenses, setExpenses] = useState<
        Expense[]
    >([]);

    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const refreshExpenses = async () => {
        try {
            setLoading(true);

            const storedExpenses =
                await getData<Expense[]>(
                    STORAGE_KEYS.EXPENSES,
                );

            if (storedExpenses) {
                setExpenses(storedExpenses);
            }
        } catch (err) {
            setError('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshExpenses();
        loadQueueCount();
    }, []);

    const syncNow =
        async (): Promise<void> => {
            try {
                setSyncing(true);

                const queue =
                    await getPendingQueue();

                const remainingQueue: QueueItem[] =
                    [];

                for (const item of queue) {
                    try {
                        if (
                            item.type ===
                            'CREATE'
                        ) {
                            await createExpense(
                                item.payload,
                            );
                        }

                        if (
                            item.type ===
                            'UPDATE'
                        ) {
                            try {
                                await updateExpense(
                                    item.payload.id,
                                    item.payload,
                                );
                            } catch (
                            error
                            ) {
                                if (
                                    is404Error(
                                        error,
                                    )
                                ) {
                                    await createExpense(
                                        item.payload,
                                    );
                                } else {
                                    throw error;
                                }
                            }
                        }

                        if (
                            item.type ===
                            'DELETE'
                        ) {
                            try {
                                await deleteExpense(
                                    item.payload.id,
                                );
                            } catch (
                            error
                            ) {
                                if (
                                    !is404Error(
                                        error,
                                    )
                                ) {
                                    throw error;
                                }
                            }
                        }
                    } catch (error) {
                        remainingQueue.push(
                            item,
                        );
                    }
                }

                await savePendingQueue(
                    remainingQueue,
                );

                setQueueCount(
                    remainingQueue.length,
                );
            } catch (error) {
                console.log(error);
            } finally {
                setSyncing(false);
            }
        };

    useEffect(() => {
        const unsubscribe =
            NetInfo.addEventListener(
                state => {
                    if (
                        state.isConnected
                    ) {
                        syncNow();
                    }
                },
            );

        return unsubscribe;
    }, []);

    const addExpense = async (
        expense: Expense,
    ) => {
        try {
            const updatedExpenses = [
                expense,
                ...expenses,
            ];

            setExpenses(updatedExpenses);

            await saveData(
                STORAGE_KEYS.EXPENSES,
                updatedExpenses,
            );
        } catch (err) {
            setError('Failed to add expense');
        }
    };

    const updateExpenseById = async (
        expenseId: string,
        updatedExpense: Expense,
    ) => {
        try {
            const updatedExpenses = expenses.map(
                item =>
                    item.id === expenseId
                        ? updatedExpense
                        : item,
            );

            setExpenses(updatedExpenses);

            await saveData(
                STORAGE_KEYS.EXPENSES,
                updatedExpenses,
            );
        } catch (err) {
            setError('Failed to update expense');
        }
    };

    const deleteExpenseById = async (
        expenseId: string,
    ) => {
        try {
            const updatedExpenses =
                expenses.filter(
                    item => item.id !== expenseId,
                );

            setExpenses(updatedExpenses);

            await saveData(
                STORAGE_KEYS.EXPENSES,
                updatedExpenses,
            );
        } catch (err) {
            setError('Failed to delete expense');
        }
    };

    const getExpenseById = (
        expenseId: string,
    ) => {
        return expenses.find(
            item => item.id === expenseId,
        );
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                loading,
                error,
                setError,
                addExpense,
                updateExpenseById,
                deleteExpenseById,
                getExpenseById,
                refreshExpenses,
                queueCount,
                syncing,
                syncNow,
                filters,
                setFilters,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context =
        useContext(ExpenseContext);

    if (!context) {
        throw new Error(
            'ExpenseContext missing',
        );
    }

    return context;
};