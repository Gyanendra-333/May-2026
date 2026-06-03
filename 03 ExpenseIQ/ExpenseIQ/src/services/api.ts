import axios from 'axios';

const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
});

export const getExpenses = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createExpense = async <T>(payload: T) => {
    try {
        const response = await api.post('/posts', payload);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateExpense = async <T>(
    id: string,
    payload: T,
) => {
    try {
        const response = await api.put(`/posts/${id}`, payload);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteExpense = async (id: string) => {
    try {
        const response = await api.delete(`/posts/${id}`);

        return response.data;
    } catch (error) {
        throw error;
    }
};