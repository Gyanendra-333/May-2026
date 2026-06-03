import React, {
    useRef,
} from 'react';

import {
    Alert,
    Animated,
    PanResponder,
    Pressable,
    Text,
    View,
} from 'react-native';

import { Expense } from '../types/expense';

interface Props {
    item: Expense;
    onPress: () => void;
    onDelete: () => void;
}

const categoryColors = {
    food: '#4CAF50',
    travel: '#2196F3',
    bills: '#FF9800',
    health: '#9C27B0',
    other: '#607D8B',
};

const SwipeableExpenseRow = ({
    item,
    onPress,
    onDelete,
}: Props) => {
    const translateX =
        useRef(
            new Animated.Value(0),
        ).current;

    const panResponder =
        useRef(
            PanResponder.create({
                onMoveShouldSetPanResponder:
                    (_, gesture) =>
                        Math.abs(
                            gesture.dx,
                        ) > 10,

                onPanResponderMove:
                    (_, gesture) => {
                        if (
                            gesture.dx < 0
                        ) {
                            translateX.setValue(
                                gesture.dx,
                            );
                        }
                    },

                onPanResponderRelease:
                    (_, gesture) => {
                        if (
                            gesture.dx <
                            -100
                        ) {
                            Alert.alert(
                                'Delete Expense',
                                'Are you sure you want to delete this expense?',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress:
                                            () => {
                                                Animated.spring(
                                                    translateX,
                                                    {
                                                        toValue:
                                                            0,
                                                        useNativeDriver:
                                                            true,
                                                    },
                                                ).start();
                                            },
                                    },
                                    {
                                        text: 'Delete',
                                        style:
                                            'destructive',
                                        onPress:
                                            () => {
                                                onDelete();
                                            },
                                    },
                                ],
                            );
                        } else {
                            Animated.spring(
                                translateX,
                                {
                                    toValue: 0,
                                    useNativeDriver:
                                        true,
                                },
                            ).start();
                        }
                    },
            }),
        ).current;

    return (
        <View
            style={{
                marginBottom: 10,
            }}
        >
            <View
                style={{
                    position:
                        'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 120,
                    backgroundColor:
                        '#D32F2F',
                    justifyContent:
                        'center',
                    alignItems:
                        'center',
                    borderRadius: 8,
                }}
            >
                <Text
                    style={{
                        color: '#fff',
                        fontWeight:
                            '700',
                    }}
                >
                    DELETE
                </Text>
            </View>

            <Animated.View
                {...panResponder.panHandlers}
                style={{
                    transform: [
                        {
                            translateX,
                        },
                    ],
                }}
            >
                <Pressable
                    onPress={onPress}
                    style={{
                        backgroundColor:
                            '#fff',
                        padding: 12,
                        borderRadius: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection:
                                'row',
                            justifyContent:
                                'space-between',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight:
                                        '600',
                                }}
                            >
                                {item.title}
                            </Text>

                            <View
                                style={{
                                    flexDirection:
                                        'row',
                                    alignItems:
                                        'center',
                                    marginTop: 6,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor:
                                            categoryColors[
                                            item
                                                .category
                                            ],
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                '#fff',
                                        }}
                                    >
                                        {
                                            item.category
                                        }
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
                                fontWeight:
                                    '700',
                            }}
                        >
                            ₹
                            {item.amount.toFixed(
                                2,
                            )}
                        </Text>
                    </View>
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default SwipeableExpenseRow;