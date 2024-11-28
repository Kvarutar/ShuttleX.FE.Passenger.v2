import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { useSelector } from 'react-redux';

import { isLoggedInSelector } from '../core/auth/redux/selectors';
import AuthScreen from '../screens/auth/AuthScreen';
import SignInCodeScreen from '../screens/auth/SignInCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import TermsScreen from '../screens/auth/TermsScreen';
import AccountSettings from '../screens/menu/AccountSettings';
import AccountVerificateCodeScreen from '../screens/menu/AccountVerificateCodeScreen';
import ActivityScreen from '../screens/menu/ActivityScreen';
import NotificationsScreen from '../screens/menu/NotificationsScreen';
import ProfilePhotoScreen from '../screens/menu/ProfilePhotoScreen';
import PromocodesScreen from '../screens/menu/PromocodesScreen';
import TicketWalletScreen from '../screens/menu/TicketWalletScreen';
import AddPaymentScreen from '../screens/menu/wallet/AddPaymentScreen';
import WalletScreen from '../screens/menu/wallet/WalletScreen';
import RaffleScreen from '../screens/raffle';
import MapAddressSelectionScreen from '../screens/ride/MapAddressSelectionScreen';
import RatingScreen from '../screens/ride/RatingScreen';
import ReceiptScreen from '../screens/ride/ReceiptScreen';
import RideScreen from '../screens/ride/RideScreen';
import { RootStackParamList } from './props';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigate = (): JSX.Element => {
  const isLoggedIn = useSelector(isLoggedInSelector);

  return (
    <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Ride" component={RideScreen} />
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
            <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettings} />
            <Stack.Screen name="PromocodesScreen" component={PromocodesScreen} />
            <Stack.Screen name="AccountVerificateCode" component={AccountVerificateCodeScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
            <Stack.Screen name="TicketWallet" component={TicketWalletScreen} />
            <Stack.Screen name="Raffle" component={RaffleScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="SignInCode" component={SignInCodeScreen} />
          </>
        )}
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
