import React from 'react';

import {
    Pressable,
    Text,
    View,
} from 'react-native';

import { Expense } from '../types/expense';

interface Props {
    item: Expense;
    onPress: () => void;
}

const categoryColors = {
    food: '#4CAF50',
    travel: '#2196F3',
    bills: '#FF9800',
    health: '#9C27B0',
    other: '#607D8B',
};

const ExpenseRow = ({
    item,
    onPress,
}: Props) => {
    return (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: '#fff',
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent:
                        'space-between',
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '600',
                        }}
                    >
                        {item.title}
                    </Text>

                    <View
                        style={{
                            marginTop: 6,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor:
                                    categoryColors[
                                    item.category
                                    ],
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                }}
                            >
                                {item.category}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                marginLeft: 10,
                                backgroundColor:
                                    item.synced
                                        ? 'green'
                                        : 'orange',
                            }}
                        />
                    </View>
                </View>

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '700',
                    }}
                >
                    ₹ {item.amount.toFixed(2)}
                </Text>
            </View>
        </Pressable>
    );
};

export default ExpenseRow;