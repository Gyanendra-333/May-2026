import React from 'react';

import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
    useExpenses,
} from '../context/ExpenseContext';

import {
    RootStackParamList,
} from '../types/navigation';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'ExpenseDetail'
    >;

const ExpenseDetailScreen = ({
    route,
    navigation,
}: Props) => {
    const { expenseId } =
        route.params;

    const {
        getExpenseById,
        deleteExpenseById,
    } = useExpenses();

    const expense =
        getExpenseById(
            expenseId,
        );

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

    const handleDelete =
        () => {
            Alert.alert(
                'Delete Expense',
                'Are you sure?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        style:
                            'destructive',
                        onPress:
                            async () => {
                                try {
                                    await deleteExpenseById(
                                        expense.id,
                                    );

                                    navigation.goBack();
                                } catch (error) {
                                    console.log(
                                        error,
                                    );
                                }
                            },
                    },
                ],
            );
        };

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 16,
            }}
        >
            <View
                style={{
                    backgroundColor:
                        '#fff',
                    padding: 16,
                    borderRadius: 10,
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight:
                            '700',
                        marginBottom: 16,
                    }}
                >
                    {expense.title}
                </Text>

                <View
                    style={{
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            fontWeight:
                                '600',
                        }}
                    >
                        Amount
                    </Text>

                    <Text>
                        ₹
                        {expense.amount.toFixed(
                            2,
                        )}
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            fontWeight:
                                '600',
                        }}
                    >
                        Category
                    </Text>

                    <Text>
                        {
                            expense.category
                        }
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            fontWeight:
                                '600',
                        }}
                    >
                        Date
                    </Text>

                    <Text>
                        {expense.date}
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            fontWeight:
                                '600',
                        }}
                    >
                        Note
                    </Text>

                    <Text>
                        {expense.note ||
                            '-'}
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            fontWeight:
                                '600',
                        }}
                    >
                        Sync Status
                    </Text>

                    <View
                        style={{
                            marginTop: 8,
                            alignSelf:
                                'flex-start',
                            backgroundColor:
                                expense.synced
                                    ? '#DFF5E1'
                                    : '#FFF3CD',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20,
                        }}
                    >
                        <Text>
                            {expense.synced
                                ? 'Synced'
                                : 'Pending'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(
                            'EditExpense',
                            {
                                expenseId:
                                    expense.id,
                            },
                        )
                    }
                    style={{
                        backgroundColor:
                            '#111',
                        padding: 16,
                        borderRadius: 8,
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            textAlign:
                                'center',
                        }}
                    >
                        Edit Expense
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={
                        handleDelete
                    }
                    style={{
                        backgroundColor:
                            '#D32F2F',
                        padding: 16,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            textAlign:
                                'center',
                        }}
                    >
                        Delete Expense
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ExpenseDetailScreen;