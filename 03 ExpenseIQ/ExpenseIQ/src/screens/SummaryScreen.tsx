import React from 'react';

import {
    ScrollView,
    Text,
    View,
} from 'react-native';

import { useExpenses } from '../context/ExpenseContext';

const SummaryScreen = () => {
    const { expenses } =
        useExpenses();

    const totalSpend =
        expenses.reduce(
            (sum, item) =>
                sum +
                item.amount,
            0,
        );

    const unsyncedCount =
        expenses.filter(
            item =>
                !item.synced,
        ).length;

    const categoryTotals =
        expenses.reduce<
            Record<
                string,
                number
            >
        >((acc, item) => {
            acc[
                item.category
            ] =
                (acc[
                    item.category
                ] ?? 0) +
                item.amount;

            return acc;
        }, {});

    const maxValue =
        Math.max(
            ...Object.values(
                categoryTotals,
            ),
            1,
        );

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 16,
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    fontWeight:
                        '700',
                    marginBottom: 20,
                }}
            >
                Summary
            </Text>

            <Text>
                Total Spend
            </Text>

            <Text
                style={{
                    fontSize: 28,
                    fontWeight:
                        '700',
                    marginBottom: 20,
                }}
            >
                ₹
                {totalSpend.toFixed(
                    2,
                )}
            </Text>

            <Text>
                Unsynced Items:
                {
                    unsyncedCount
                }
            </Text>

            <View
                style={{
                    marginTop: 30,
                }}
            >
                {Object.entries(
                    categoryTotals,
                ).map(
                    ([
                        category,
                        amount,
                    ]) => (
                        <View
                            key={
                                category
                            }
                            style={{
                                marginBottom: 20,
                            }}
                        >
                            <Text>
                                {
                                    category
                                } - ₹
                                {amount.toFixed(
                                    2,
                                )}
                            </Text>

                            <View
                                style={{
                                    height: 20,
                                    backgroundColor:
                                        '#ddd',
                                    marginTop: 4,
                                }}
                            >
                                <View
                                    style={{
                                        height: 20,
                                        width: `${(amount /
                                            maxValue) *
                                            100
                                            }%`,
                                        backgroundColor:
                                            '#111',
                                    }}
                                />
                            </View>
                        </View>
                    ),
                )}
            </View>
        </ScrollView>
    );
};

export default SummaryScreen;