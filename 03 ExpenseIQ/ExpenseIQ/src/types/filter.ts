import { ExpenseCategory } from './expense';

export interface ExpenseFilters {
    categories: ExpenseCategory[];

    startDate: string | null;

    endDate: string | null;

    minAmount: string;

    maxAmount: string;
}