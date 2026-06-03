import {
    getData,
    saveData,
} from './asyncStorage';

import {
    STORAGE_KEYS,
} from '../constants/storageKeys';

import {
    QueueItem,
} from '../types/queue';

export const getPendingQueue =
    async (): Promise<
        QueueItem[]
    > => {
        try {
            const queue =
                await getData<
                    QueueItem[]
                >(
                    STORAGE_KEYS.PENDING_QUEUE,
                );

            return queue ?? [];
        } catch (error) {
            throw error;
        }
    };

export const savePendingQueue =
    async (
        queue: QueueItem[],
    ): Promise<void> => {
        try {
            await saveData(
                STORAGE_KEYS.PENDING_QUEUE,
                queue,
            );
        } catch (error) {
            throw error;
        }
    };

export const addToQueue =
    async (
        item: QueueItem,
    ): Promise<void> => {
        try {
            const queue =
                await getPendingQueue();

            queue.push(item);

            await savePendingQueue(
                queue,
            );
        } catch (error) {
            throw error;
        }
    };