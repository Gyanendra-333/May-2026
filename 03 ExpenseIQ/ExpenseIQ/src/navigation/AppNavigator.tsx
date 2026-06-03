import React from 'react';

import {
    NavigationContainer,
} from '@react-navigation/native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AddExpenseScreen from '../screens/AddExpenseScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';

import { RootStackParamList } from '../types/navigation';
import BottomTabs from './BottomTabs';

const Stack =
    createNativeStackNavigator<RootStackParamList>();


const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={BottomTabs}
                />

                <Stack.Screen
                    name="AddExpense"
                    component={AddExpenseScreen}
                />

                <Stack.Screen
                    name="ExpenseDetail"
                    component={ExpenseDetailScreen}
                />

                <Stack.Screen
                    name="EditExpense"
                    component={EditExpenseScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;