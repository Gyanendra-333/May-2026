import React, {
    useState,
} from 'react';

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
    Controller,
    useForm,
} from 'react-hook-form';

import {
    yupResolver,
} from '@hookform/resolvers/yup';

import {
    RootStackParamList,
} from '../types/navigation';

import {
    Expense,
    ExpenseCategory,
} from '../types/expense';

import NetInfo from '@react-native-community/netinfo';

import {
    addToQueue,
} from '../storage/queueStorage';
import {
    expenseSchema,
} from '../validation/expenseSchema';

import {
    useExpenses,
} from '../context/ExpenseContext';

import {
    updateExpense,
} from '../services/api';

import {
    CATEGORIES,
} from '../constants/categories';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'EditExpense'
    >;

interface FormData {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
}

const EditExpenseScreen = ({
    route,
    navigation,
}: Props) => {
    const { expenseId } =
        route.params;

    const {
        getExpenseById,
        updateExpenseById,
    } = useExpenses();

    const expense =
        getExpenseById(
            expenseId,
        );

    const [apiError, setApiError] =
        useState(false);

    if (!expense) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent:
                        'center',
                    alignItems:
                        'center',
                }}
            >
                <Text>
                    Expense not found
                </Text>
            </View>
        );
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver:
            yupResolver(
                expenseSchema,
            ),
        defaultValues: {
            title:
                expense.title,
            amount:
                expense.amount,
            category:
                expense.category,
            date:
                expense.date,
            note:
                expense.note ??
                '',
        },
    });

    const onSubmit = async (
        data: FormData,
    ) => {
        try {
            setApiError(false);

            const updatedExpense: Expense =
            {
                ...expense,
                title:
                    data.title,
                amount:
                    Number(
                        Number(
                            data.amount,
                        ).toFixed(
                            2,
                        ),
                    ),
                category:
                    data.category,
                date:
                    data.date,
                note:
                    data.note,
                synced:
                    false,
            };

            // optimistic update

            await updateExpenseById(
                expense.id,
                updatedExpense,
            );
            const netState =
                await NetInfo.fetch();

            if (
                !netState.isConnected
            ) {
                await addToQueue({
                    type: 'UPDATE',
                    payload:
                        updatedExpense,
                });

                navigation.goBack();

                return;
            }

            try {
                await updateExpense(
                    expense.id,
                    updatedExpense,
                );

                await updateExpenseById(
                    expense.id,
                    {
                        ...updatedExpense,
                        synced:
                            true,
                    },
                );
            } catch (error) {
                setApiError(true);
            }

            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
            }}
            behavior={
                Platform.OS ===
                    'ios'
                    ? 'padding'
                    : undefined
            }
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                }}
            >
                {apiError && (
                    <View
                        style={{
                            backgroundColor:
                                '#FFE5E5',
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 16,
                        }}
                    >
                        <Text>
                            Update
                            synced
                            failed.
                            Local data
                            updated
                            successfully.
                        </Text>
                    </View>
                )}

                <Text>
                    Title
                </Text>

                <Controller
                    control={
                        control
                    }
                    name="title"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            value={
                                value
                            }
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
                        color:
                            'red',
                        marginBottom: 8,
                    }}
                >
                    {errors
                        .title
                        ?.message ??
                        ''}
                </Text>

                <Text>
                    Amount
                </Text>

                <Controller
                    control={
                        control
                    }
                    name="amount"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            keyboardType="decimal-pad"
                            value={String(
                                value,
                            )}
                            onChangeText={text =>
                                onChange(
                                    Number(
                                        text,
                                    ),
                                )
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
                        color:
                            'red',
                        marginBottom: 8,
                    }}
                >
                    {errors
                        .amount
                        ?.message ??
                        ''}
                </Text>

                <Text>
                    Category
                </Text>

                <Controller
                    control={
                        control
                    }
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
                                        key={
                                            item
                                        }
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
                                            {
                                                item
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                ),
                            )}
                        </View>
                    )}
                />

                <Text
                    style={{
                        color:
                            'red',
                        marginBottom: 8,
                    }}
                >
                    {errors
                        .category
                        ?.message ??
                        ''}
                </Text>

                <Text>
                    Date
                </Text>

                <Controller
                    control={
                        control
                    }
                    name="date"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            value={
                                value
                            }
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
                        color:
                            'red',
                        marginBottom: 8,
                    }}
                >
                    {errors
                        .date
                        ?.message ??
                        ''}
                </Text>

                <Text>
                    Note
                </Text>

                <Controller
                    control={
                        control
                    }
                    name="note"
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <TextInput
                            multiline
                            value={
                                value
                            }
                            onChangeText={
                                onChange
                            }
                            style={{
                                borderWidth: 1,
                                minHeight: 120,
                                padding: 12,
                                marginTop: 6,
                            }}
                        />
                    )}
                />

                <Text
                    style={{
                        color:
                            'red',
                        marginBottom: 8,
                    }}
                >
                    {errors
                        .note
                        ?.message ??
                        ''}
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
                            color:
                                '#fff',
                            textAlign:
                                'center',
                            fontWeight:
                                '600',
                        }}
                    >
                        Update
                        Expense
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditExpenseScreen;