import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async <T>(
    key: string,
    value: T,
): Promise<void> => {
    try {
        await AsyncStorage.setItem(
            key,
            JSON.stringify(value),
        );
    } catch (error) {
        throw error;
    }
};

export const getData = async <T>(
    key: string,
): Promise<T | null> => {
    try {
        const data = await AsyncStorage.getItem(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data) as T;
    } catch (error) {
        throw error;
    }
};

export const removeData = async (
    key: string,
): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        throw error;
    }
};