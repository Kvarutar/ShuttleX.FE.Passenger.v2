import notifee from '@notifee/react-native';

import { store } from '../../redux/store';
import { addFinishedTrips } from '../../ride/redux/trip';
import { fetchContractorInfo } from '../../ride/redux/trip/thunks';
import { RemoteMessage } from './notificationTypes';

//display notiff without buttons
type NotificationTitle =
  | 'driver_accepted'
  | 'no_availible_drivers'
  | 'trip_started'
  | 'trip_ended'
  | 'driver_arrived'
  | 'driver_rejected'
  | 'winner_founded';

const isNotificationTitle = (key: string): key is NotificationTitle =>
  [
    'driver_accepted',
    'no_availible_drivers',
    'trip_started',
    'trip_ended',
    'driver_arrived',
    'driver_rejected',
    'winner_founded',
  ].includes(key);

export const displayNotificationForAll = async (remoteMessage: RemoteMessage) => {
  const { key, payload } = remoteMessage.data;
  let payloadData;

  if (payload) {
    payloadData = JSON.parse(payload);
  }

  const orderId = payloadData.OrderId;
  const prizeId = payloadData.PrizeIds;

  if (isNotificationTitle(key)) {
    switch (key) {
      case 'driver_accepted':
        store.dispatch(fetchContractorInfo(orderId));
        break;
      case 'trip_ended':
        store.dispatch(addFinishedTrips());
        break;
      case 'winner_founded':
        console.log(prizeId);
        break;
      case 'no_availible_drivers':
        // console.log(prizeId);
        break;
      case 'driver_arrived':
        //TODO add case
        break;
      case 'driver_rejected':
        //TODO add case
        break;
      case 'trip_started':
        //TODO add case
        break;
      //TODO add to redux prizeId
    }
    //TODO change ride status setTripStatus
  }

  await notifee.displayNotification({
    title: remoteMessage.data.title,
    body: remoteMessage.data.body,

    android: {
      channelId: 'general-channel',
      smallIcon: 'bootsplash_logo',
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
};
