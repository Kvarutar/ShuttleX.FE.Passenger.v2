import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { useTheme } from 'shuttlex-integration';

import AuthScreen from '../screens/auth/AuthScreen';
import PhoneSelectScreen from '../screens/auth/PhoneSelectScreen';
import SignInEmailCodeScreen from '../screens/auth/SignInEmailCodeScreen';
import SignInPhoneCodeScreen from '../screens/auth/SignInPhoneCodeScreen';
import SignUpPhoneCodeScreen from '../screens/auth/SignUpPhoneCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import TermsScreen from '../screens/auth/TermsScreen';
import NotificationsScreen from '../screens/menu/NotificationsScreen';
import AddPaymentScreen from '../screens/menu/wallet/AddPaymentScreen';
import WalletScreen from '../screens/menu/wallet/WalletScreen';
import AddressSelectionScreen from '../screens/ride/AddressSelectionScreen';
import MapAddressSelectionScreen from '../screens/ride/MapAddressSelectionScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import ReceiptScreen from '../screens/ride/ReceiptScreen';
import RideScreen from '../screens/ride/RideScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => {
  const { setThemeMode } = useTheme();

  useEffect(() => {
    setThemeMode('dark');
  }, [setThemeMode]);

  return (
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
        <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
        <Stack.Screen
          name="MapAddressSelection"
          component={MapAddressSelectionScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} />
        <Stack.Screen name="PhoneSelect" component={PhoneSelectScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
