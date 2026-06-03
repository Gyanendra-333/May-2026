import React from 'react';

import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useExpenses } from '../context/ExpenseContext';

import { CATEGORIES } from '../constants/categories';

const FiltersScreen = () => {
    const {
        filters,
        setFilters,
    } = useExpenses();

    const toggleCategory =
        (category: string) => {
            const exists =
                filters.categories.includes(
                    category as never,
                );

            if (exists) {
                setFilters(prev => ({
                    ...prev,
                    categories:
                        prev.categories.filter(
                            item =>
                                item !==
                                category,
                        ),
                }));
            } else {
                setFilters(prev => ({
                    ...prev,
                    categories: [
                        ...prev.categories,
                        category as never,
                    ],
                }));
            }
        };

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 16,
            }}
        >
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '700',
                    marginBottom: 20,
                }}
            >
                Filters
            </Text>

            <Text>
                Categories
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 10,
                }}
            >
                {CATEGORIES.map(
                    category => {
                        const selected =
                            filters.categories.includes(
                                category,
                            );

                        return (
                            <TouchableOpacity
                                key={
                                    category
                                }
                                onPress={() =>
                                    toggleCategory(
                                        category,
                                    )
                                }
                                style={{
                                    padding: 10,
                                    borderWidth: 1,
                                    marginRight: 8,
                                    marginBottom: 8,
                                    backgroundColor:
                                        selected
                                            ? '#ddd'
                                            : '#fff',
                                }}
                            >
                                <Text>
                                    {
                                        category
                                    }
                                </Text>
                            </TouchableOpacity>
                        );
                    },
                )}
            </View>

            <Text>
                Start Date
            </Text>

            <TextInput
                value={
                    filters.startDate ??
                    ''
                }
                onChangeText={text =>
                    setFilters(
                        prev => ({
                            ...prev,
                            startDate:
                                text,
                        }),
                    )
                }
                placeholder="2026-06-01"
                style={{
                    borderWidth: 1,
                    padding: 12,
                    marginTop: 6,
                    marginBottom: 12,
                }}
            />

            <Text>
                End Date
            </Text>

            <TextInput
                value={
                    filters.endDate ??
                    ''
                }
                onChangeText={text =>
                    setFilters(
                        prev => ({
                            ...prev,
                            endDate:
                                text,
                        }),
                    )
                }
                placeholder="2026-06-30"
                style={{
                    borderWidth: 1,
                    padding: 12,
                    marginTop: 6,
                    marginBottom: 12,
                }}
            />

            <Text>
                Min Amount
            </Text>

            <TextInput
                keyboardType="numeric"
                value={
                    filters.minAmount
                }
                onChangeText={text =>
                    setFilters(
                        prev => ({
                            ...prev,
                            minAmount:
                                text,
                        }),
                    )
                }
                style={{
                    borderWidth: 1,
                    padding: 12,
                    marginTop: 6,
                    marginBottom: 12,
                }}
            />

            <Text>
                Max Amount
            </Text>

            <TextInput
                keyboardType="numeric"
                value={
                    filters.maxAmount
                }
                onChangeText={text =>
                    setFilters(
                        prev => ({
                            ...prev,
                            maxAmount:
                                text,
                        }),
                    )
                }
                style={{
                    borderWidth: 1,
                    padding: 12,
                    marginTop: 6,
                }}
            />
        </ScrollView>
    );
};

export default FiltersScreen;