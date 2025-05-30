import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Linking } from 'react-native';
import {
  check,
  checkLocationAccuracy,
  LocationAccuracy,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import { IS_IOS } from 'shuttlex-integration';

export const requestGeolocationPermission = async (): Promise<void> => {
  if (IS_IOS) {
    await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
};

export const checkGeolocationPermissionAndAccuracy = async (): Promise<{
  isGranted: boolean;
  accuracy: LocationAccuracy;
}> => {
  if (IS_IOS) {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    const accuracy: LocationAccuracy = result === RESULTS.GRANTED ? await checkLocationAccuracy() : 'reduced';
    return { isGranted: result === RESULTS.GRANTED, accuracy };
  } else {
    const [resultFine, resultCoarse] = await Promise.all([
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
      check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
    ]);
    const isGranted = resultFine === RESULTS.GRANTED || resultCoarse === RESULTS.GRANTED;
    const accuracy: LocationAccuracy =
      resultFine === RESULTS.GRANTED && resultCoarse === RESULTS.GRANTED ? 'full' : 'reduced';

    return { isGranted, accuracy };
  }
};

//notifications permission
export const requestNotificationsPermission = async () => {
  const settings = await notifee.requestPermission();

  if (
    settings.authorizationStatus === AuthorizationStatus.DENIED ||
    settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
  ) {
    Alert.alert(
      'Turn on notifications',
      'Please turn on notifications to receive information about trips, new events and more',
      [
        {
          text: 'Not now',
        },
        {
          text: 'Settings',
          onPress: Linking.openSettings,
        },
      ],
    );
  }
};
