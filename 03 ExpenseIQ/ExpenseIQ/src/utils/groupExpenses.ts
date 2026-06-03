import { Expense } from '../types/expense';

export interface ExpenseSection {
    title: string;
    total: number;
    data: Expense[];
}

export const groupExpensesByDate = (
    expenses: Expense[],
): ExpenseSection[] => {
    const grouped: Record<
        string,
        Expense[]
    > = {};

    expenses.forEach(expense => {
        const date =
            expense.date.split('T')[0];

        if (!grouped[date]) {
            grouped[date] = [];
        }

        grouped[date].push(expense);
    });

    return Object.keys(grouped)
        .sort(
            (a, b) =>
                new Date(b).getTime() -
                new Date(a).getTime(),
        )
        .map(date => ({
            title: date,
            total: grouped[date].reduce(
                (sum, item) =>
                    sum + item.amount,
                0,
            ),
            data: grouped[date],
        }));
};