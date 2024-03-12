import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BootSplash from 'react-native-bootsplash';

import AuthScreen from '../screens/auth/AuthScreen';
import SignInEmailCodeScreen from '../screens/auth/SignInEmailCodeScreen';
import SignInPhoneCodeScreen from '../screens/auth/SignInPhoneCodeScreen';
import SignUpPhoneCodeScreen from '../screens/auth/SignUpPhoneCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import AddressSelectionScreen from '../screens/ride/AddressSelectionScreen';
import PaymentMethodSelectionScreen from '../screens/ride/PaymentMethodSelectionScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import RideScreen from '../screens/ride/RideScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => (
  <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Ride" component={RideScreen} />
      <Stack.Screen name="SignUpPhoneCode" component={SignUpPhoneCodeScreen} />
      <Stack.Screen name="SignInPhoneCode" component={SignInPhoneCodeScreen} />
      <Stack.Screen name="SignInEmailCode" component={SignInEmailCodeScreen} />
      <Stack.Screen name="PaymentMethodSelection" component={PaymentMethodSelectionScreen} />
      <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigate;
