import * as yup from 'yup';

export const expenseSchema = yup.object({
    title: yup
        .string()
        .required('Title is required')
        .max(60, 'Maximum 60 characters'),

    amount: yup
        .number()
        .typeError('Amount is required')
        .positive('Amount must be positive')
        .required('Amount is required'),

    category: yup.string().required('Category is required'),

    date: yup.string().required('Date is required'),

    note: yup
        .string()
        .max(200, 'Maximum 200 characters')
        .optional(),
});