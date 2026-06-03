import { Expense } from './expense';

export type QueueAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface QueueItem {
    type: QueueAction;
    payload: Expense;
}