import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Button,
    SectionList,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useExpenses } from '../context/ExpenseContext';

import { RootStackParamList } from '../types/navigation';

import SwipeableExpenseRow from '../components/SwipeableExpenseRow';

import { deleteExpense } from '../services/api';
import EmptyState from '../components/EmptyState';

import SkeletonLoader from '../components/SkeletonLoader';

import {
    groupExpensesByDate,
} from '../utils/groupExpenses';

import {
    getData,
    saveData,
} from '../storage/asyncStorage';

import {
    STORAGE_KEYS,
} from '../constants/storageKeys';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'Home'
    >;



type SortType =
    | 'date'
    | 'amount'
    | 'title';

const HomeScreen = ({
    navigation,
}: Props) => {
    const {
        expenses,
        deleteExpenseById,
        queueCount,
        syncing,
        syncNow,
        filters,
        loading
    } = useExpenses();

    const [search, setSearch] =
        useState('');

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState('');

    const [sortType, setSortType] =
        useState<SortType>('date');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () =>
            clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        loadSortPreference();
    }, []);

    const loadSortPreference =
        async () => {
            try {
                const saved =
                    await getData<SortType>(
                        STORAGE_KEYS.SORT_PREFERENCE,
                    );

                if (saved) {
                    setSortType(saved);
                }
            } catch (error) {
                console.log(error);
            }
        };

    const updateSort =
        async (
            value: SortType,
        ) => {
            try {
                setSortType(value);

                await saveData(
                    STORAGE_KEYS.SORT_PREFERENCE,
                    value,
                );
            } catch (error) {
                console.log(error);
            }
        };

    const filteredExpenses =
        useMemo(() => {
            let result = [
                ...expenses,
            ];

            result =
                result.filter(
                    expense =>
                        expense.title
                            .toLowerCase()
                            .includes(
                                debouncedSearch.toLowerCase(),
                            ),
                );

            if (
                filters.categories
                    .length > 0
            ) {
                result =
                    result.filter(
                        expense =>
                            filters.categories.includes(
                                expense.category,
                            ),
                    );
            }

            if (
                filters.startDate
            ) {
                result =
                    result.filter(
                        expense =>
                            new Date(
                                expense.date,
                            ) >=
                            new Date(
                                filters.startDate,
                            ),
                    );
            }

            if (
                filters.endDate
            ) {
                result =
                    result.filter(
                        expense =>
                            new Date(
                                expense.date,
                            ) <=
                            new Date(
                                filters.endDate,
                            ),
                    );
            }

            if (
                filters.minAmount
            ) {
                result =
                    result.filter(
                        expense =>
                            expense.amount >=
                            Number(
                                filters.minAmount,
                            ),
                    );
            }

            if (
                filters.maxAmount
            ) {
                result =
                    result.filter(
                        expense =>
                            expense.amount <=
                            Number(
                                filters.maxAmount,
                            ),
                    );
            }

            if (
                sortType ===
                'amount'
            ) {
                result.sort(
                    (a, b) =>
                        b.amount -
                        a.amount,
                );
            }

            if (
                sortType ===
                'title'
            ) {
                result.sort(
                    (a, b) =>
                        a.title.localeCompare(
                            b.title,
                        ),
                );
            }

            if (
                sortType ===
                'date'
            ) {
                result.sort(
                    (a, b) =>
                        new Date(
                            b.date,
                        ).getTime() -
                        new Date(
                            a.date,
                        ).getTime(),
                );
            }

            return result;
        }, [
            expenses,
            filters,
            debouncedSearch,
            sortType,
        ]);

    const sections =
        groupExpensesByDate(
            filteredExpenses,
        );

    const handleDelete =
        async (
            expenseId: string,
        ) => {
            try {
                await deleteExpenseById(
                    expenseId,
                );

                try {
                    await deleteExpense(
                        expenseId,
                    );
                } catch (error) {
                    console.log(
                        'Delete sync failed',
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                }}
            >
                <Text>
                    Pending:
                    {queueCount}
                </Text>

                <Button
                    title={
                        syncing
                            ? 'Syncing...'
                            : 'Sync Now'
                    }
                    onPress={syncNow}
                />
            </View>
            <TextInput
                placeholder="Search expenses"
                value={search}
                onChangeText={setSearch}
                style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                }}
            />

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent:
                        'space-between',
                    marginBottom: 10,
                }}
            >
                <Button
                    title="Date"
                    onPress={() =>
                        updateSort('date')
                    }
                />

                <Button
                    title="Amount"
                    onPress={() =>
                        updateSort('amount')
                    }
                />

                <Button
                    title="Title"
                    onPress={() =>
                        updateSort('title')
                    }
                />

                <Button
                    title="Add"
                    onPress={() =>
                        navigation.navigate(
                            'AddExpense',
                        )
                    }
                />
            </View>

            {loading ? (
                <View
                    style={{
                        flex: 1,
                        padding: 16,
                    }}
                >
                    <SkeletonLoader />
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={item =>
                        item.id
                    }
                    renderSectionHeader={({
                        section,
                    }) => (
                        <View
                            style={{
                                paddingVertical: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                }}
                            >
                                {section.title}
                            </Text>

                            <Text>
                                Daily Total: ₹
                                {section.total.toFixed(
                                    2,
                                )}
                            </Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <SwipeableExpenseRow
                            item={item}
                            onPress={() =>
                                navigation.navigate(
                                    'ExpenseDetail',
                                    {
                                        expenseId:
                                            item.id,
                                    },
                                )
                            }
                            onDelete={() =>
                                handleDelete(
                                    item.id,
                                )
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            title={
                                search ||
                                    filters
                                        .categories
                                        .length > 0
                                    ? 'No matching expenses found'
                                    : 'No expenses found'
                            }
                        />
                    }
                />
            )}
        </View>
    );
};

export default HomeScreen;