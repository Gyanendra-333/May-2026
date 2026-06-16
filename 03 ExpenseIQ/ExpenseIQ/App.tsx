import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

import {
  ExpenseProvider,
} from './src/context/ExpenseContext';

export default function App() {
  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <ExpenseProvider>
        <AppNavigator />
      </ExpenseProvider>
    </GestureHandlerRootView>
  );
}