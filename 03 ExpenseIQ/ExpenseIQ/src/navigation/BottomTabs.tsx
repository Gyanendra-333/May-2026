import React from 'react';

import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import SummaryScreen from '../screens/SummaryScreen';
import FiltersScreen from '../screens/FiltersScreen';

const Tab =
    createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={
                    HomeScreen
                }
            />

            <Tab.Screen
                name="Summary"
                component={
                    SummaryScreen
                }
            />

            <Tab.Screen
                name="Filters"
                component={
                    FiltersScreen
                }
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;