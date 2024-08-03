import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Details from '../screens/details/Details.tsx';
import Fans from '../screens/fans/Fans.tsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export type StackParamList = {
  Fans: undefined;
  Details: {url: string};
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <SafeAreaProvider>
      <Stack.Navigator>
        <Stack.Screen name="Fans" component={Fans} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </SafeAreaProvider>
  </NavigationContainer>
);

export default AppNavigator;
