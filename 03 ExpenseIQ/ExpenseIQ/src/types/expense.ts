export type ExpenseCategory =
    | 'food'
    | 'travel'
    | 'bills'
    | 'health'
    | 'other';

export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
    synced: boolean;
}