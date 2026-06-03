import React, { useState } from 'react';

import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {
    addToQueue,
} from '../storage/queueStorage';

import uuid from 'react-native-uuid';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { yupResolver } from '@hookform/resolvers/yup';

import {
    Controller,
    useForm,
} from 'react-hook-form';

import { expenseSchema } from '../validation/expenseSchema';

import { RootStackParamList } from '../types/navigation';

import {
    Expense,
    ExpenseCategory,
} from '../types/expense';

import {
    createExpense,
} from '../services/api';

import { useExpenses } from '../context/ExpenseContext';

import {
    CATEGORIES,
} from '../constants/categories';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'AddExpense'
    >;

interface FormData {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
}

const AddExpenseScreen = ({
    navigation,
}: Props) => {
    const {
        addExpense,
        updateExpenseById,
    } = useExpenses();

    const [retryError, setRetryError] =
        useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver:
            yupResolver(expenseSchema),
        defaultValues: {
            title: '',
            amount: 0,
            category: 'food',
            date:
                new Date().toISOString(),
            note: '',
        },
    });

    const onSubmit = async (
        data: FormData,
    ) => {
        try {
            setRetryError(false);

            const expense: Expense = {
                id: uuid.v4().toString(),
                title: data.title,
                amount: Number(
                    Number(
                        data.amount,
                    ).toFixed(2),
                ),
                category:
                    data.category,
                date: data.date,
                note: data.note,
                synced: false,
            };

            // optimistic update
            const netState =
                await NetInfo.fetch();

            if (
                !netState.isConnected
            ) {
                await addToQueue({
                    type: 'CREATE',
                    payload: expense,
                });

                navigation.goBack();

                return;
            }

            await addExpense(
                expense,
            );

            try {
                await createExpense(
                    expense,
                );

                await updateExpenseById(
                    expense.id,
                    {
                        ...expense,
                        synced: true,
                    },
                );
            } catch (error) {
                setRetryError(true);
            }

            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                }}
            >
                {retryError && (
                    <View
                        style={{
                            backgroundColor:
                                '#FFE5E5',
                            padding: 12,
                            marginBottom: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Text>
                            API failed.
                            Expense saved
                            locally and will
                            sync later.
                        </Text>
                    </View>
                )}

                <Text>Title</Text>

                <Controller
                    control={control}
                    name="title"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            value={value}
                            onChangeText={
                                onChange
                            }
                            style={{
                                borderWidth: 1,
                                padding: 12,
                                marginTop: 6,
                                marginBottom: 4,
                            }}
                        />
                    )}
                />

                <Text
                    style={{
                        color: 'red',
                    }}
                >
                    {errors.title
                        ?.message ?? ''}
                </Text>

                <Text>
                    Amount
                </Text>

                <Controller
                    control={control}
                    name="amount"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            value={String(
                                value,
                            )}
                            keyboardType="decimal-pad"
                            onChangeText={text =>
                                onChange(
                                    Number(text),
                                )
                            }
                            style={{
                                borderWidth: 1,
                                padding: 12,
                                marginTop: 6,
                                marginBottom: 4,
                            }}
                        />
                    )}
                />

                <Text
                    style={{
                        color: 'red',
                    }}
                >
                    {errors.amount
                        ?.message ?? ''}
                </Text>

                <Text>
                    Category
                </Text>

                <Controller
                    control={control}
                    name="category"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <View
                            style={{
                                flexDirection:
                                    'row',
                                flexWrap:
                                    'wrap',
                                marginTop: 10,
                            }}
                        >
                            {CATEGORIES.map(
                                item => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() =>
                                            onChange(
                                                item,
                                            )
                                        }
                                        style={{
                                            padding: 10,
                                            borderWidth: 1,
                                            marginRight: 8,
                                            marginBottom: 8,
                                            backgroundColor:
                                                value ===
                                                    item
                                                    ? '#ddd'
                                                    : '#fff',
                                        }}
                                    >
                                        <Text>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ),
                            )}
                        </View>
                    )}
                />

                <Text
                    style={{
                        color: 'red',
                    }}
                >
                    {errors.category
                        ?.message ?? ''}
                </Text>

                <Text>Date</Text>

                <Controller
                    control={control}
                    name="date"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            value={value}
                            onChangeText={
                                onChange
                            }
                            style={{
                                borderWidth: 1,
                                padding: 12,
                                marginTop: 6,
                            }}
                        />
                    )}
                />

                <Text
                    style={{
                        color: 'red',
                    }}
                >
                    {errors.date
                        ?.message ?? ''}
                </Text>

                <Text
                    style={{
                        marginTop: 12,
                    }}
                >
                    Note
                </Text>

                <Controller
                    control={control}
                    name="note"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            multiline
                            value={value}
                            onChangeText={
                                onChange
                            }
                            style={{
                                borderWidth: 1,
                                padding: 12,
                                minHeight: 120,
                                marginTop: 6,
                            }}
                        />
                    )}
                />

                <Text
                    style={{
                        color: 'red',
                    }}
                >
                    {errors.note
                        ?.message ?? ''}
                </Text>

                <TouchableOpacity
                    onPress={handleSubmit(
                        onSubmit,
                    )}
                    style={{
                        backgroundColor:
                            '#111',
                        padding: 16,
                        borderRadius: 8,
                        marginTop: 20,
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            textAlign:
                                'center',
                        }}
                    >
                        Save Expense
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddExpenseScreen;