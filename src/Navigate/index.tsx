import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AuthScreen from '../screens/auth/AuthScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import RideScreen from '../screens/ride/RideScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Ride" component={RideScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigate;
