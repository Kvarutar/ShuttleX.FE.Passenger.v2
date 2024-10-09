import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { useTheme } from 'shuttlex-integration';

import AuthScreen from '../screens/auth/AuthScreen';
import LockOutScreen from '../screens/auth/LockOutScreen';
import SignInCodeScreen from '../screens/auth/SignInCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import TermsScreen from '../screens/auth/TermsScreen';
import AccountSettings from '../screens/menu/AccountSettings';
import ActivityScreen from '../screens/menu/ActivityScreen';
import NotificationsScreen from '../screens/menu/NotificationsScreen';
import AddPaymentScreen from '../screens/menu/wallet/AddPaymentScreen';
import WalletScreen from '../screens/menu/wallet/WalletScreen';
import MapAddressSelectionScreen from '../screens/ride/MapAddressSelectionScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import ReceiptScreen from '../screens/ride/ReceiptScreen';
import RideScreen from '../screens/ride/RideScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => {
  const { setThemeMode } = useTheme();

  useEffect(() => {
    setThemeMode('light');
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
        <Stack.Screen name="LockOut" component={LockOutScreen} />
        <Stack.Screen name="SignInCode" component={SignInCodeScreen} />
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
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettings} />
        <Stack.Screen name="Activity" component={ActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
