import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, AppStateStatus } from 'react-native';
import { useSelector } from 'react-redux';
import { getTokens, isCoordinatesEqualZero, Nullable, ServerErrorModal, useTheme } from 'shuttlex-integration';

import { setIsLoggedIn } from '../core/auth/redux';
import { isLoggedInSelector } from '../core/auth/redux/selectors';
import { getAllCurrentTickets } from '../core/lottery/redux/thunks';
import { passengerZoneSelector } from '../core/passenger/redux/selectors';
import { getOrUpdateZone, getProfileInfo, updateProfileLanguage } from '../core/passenger/redux/thunks';
import { useAppDispatch } from '../core/redux/hooks';
import { signalRThunks, updateSignalRAccessToken } from '../core/redux/signalr';
import { geolocationCoordinatesSelector } from '../core/ride/redux/geolocation/selectors';
import { setEstimatedPrice, setOfferId, setTripTariff, updateOfferPoint } from '../core/ride/redux/offer';
import { offerSelector } from '../core/ride/redux/offer/selectors';
import {
  createInitialOffer,
  createPhantomOffer,
  getActiveOffers,
  getAvailableTariffs,
  getOfferRoute,
  getRecentDropoffs,
  getTariffsPrices,
} from '../core/ride/redux/offer/thunks';
import { setOrderStatus } from '../core/ride/redux/order';
import { orderStatusSelector } from '../core/ride/redux/order/selectors';
import { OrderStatus } from '../core/ride/redux/order/types';
import {
  endTrip,
  setIsOrderCanceled,
  setIsOrderCanceledAlertVisible,
  setTripIsCanceled,
  setTripStatus,
} from '../core/ride/redux/trip';
import {
  isOrderCanceledSelector,
  orderSelector,
  selectedOrderIdSelector,
  tripStatusSelector,
} from '../core/ride/redux/trip/selectors';
import { getCurrentOrder, getOrderInfo, getRouteInfo } from '../core/ride/redux/trip/thunks';
import { OrderWithTariffInfo, TripStatus } from '../core/ride/redux/trip/types';
import { initializeSSEConnection } from '../core/sse';
import { getFirebaseDeviceToken, setupNotifications } from '../core/utils/notifications/notificationSetup';
import { InitialSetupProps } from './types';
import useServerErrorHandler from './utils/useServerErrorHandler';

const InitialSetup = ({ children }: InitialSetupProps) => {
  const { setThemeMode } = useTheme();
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const { isErrorAvailable } = useServerErrorHandler();

  const appState = useRef<AppStateStatus>(AppState.currentState);

  const isLoggedIn = useSelector(isLoggedInSelector);
  const defaultLocation = useSelector(geolocationCoordinatesSelector);
  const passengerZone = useSelector(passengerZoneSelector);
  const order = useSelector(orderSelector);
  const isOrderCanceled = useSelector(isOrderCanceledSelector);
  const offer = useSelector(offerSelector);
  const tripStatus = useSelector(tripStatusSelector);
  const orderStatus = useSelector(orderStatusSelector);
  const selectedOrderId = useSelector(selectedOrderIdSelector);

  const [locationLoaded, setLocationLoaded] = useState(false);
  const [isServerErrorModalVisible, setIsServerErrorModalVisible] = useState(false);

  const updatePassengerState = useCallback(async () => {
    const activeOffers = await dispatch(getActiveOffers()).unwrap();

    if (activeOffers.length === 0) {
      dispatch(getCurrentOrder());
      return;
    }

    const lastOffer = activeOffers[activeOffers.length - 1];

    const availableTariffs = await dispatch(getAvailableTariffs(lastOffer.pickUpGeo)).unwrap();
    if (!availableTariffs) {
      return;
    }

    const tariff = availableTariffs?.find(availableTariff => availableTariff.id === lastOffer.tariffId);
    if (!tariff) {
      return;
    }

    dispatch(setEstimatedPrice({ currencyCode: lastOffer.currencyCode, value: lastOffer.estimatedPrice }));
    dispatch(
      setTripTariff({
        ...tariff,
        cost: null,
        time: null,
        currency: null,
        matching: [],
        isAvaliable: false,
      }),
    );
    dispatch(setOfferId(lastOffer.id));
    dispatch(
      updateOfferPoint({
        id: 0,
        address: lastOffer.pickUpPlace,
        fullAddress: lastOffer.pickUpFullAddress,
        latitude: lastOffer.pickUpGeo.latitude,
        longitude: lastOffer.pickUpGeo.longitude,
      }),
    );
    dispatch(
      updateOfferPoint({
        id: 1,
        address: lastOffer.dropOffPlace,
        fullAddress: lastOffer.dropOffFullAddress,
        latitude: lastOffer.dropOffGeo.latitude,
        longitude: lastOffer.dropOffGeo.longitude,
      }),
    );
    dispatch(createPhantomOffer());

    await dispatch(getOfferRoute());
    dispatch(getTariffsPrices());
    dispatch(setOrderStatus(OrderStatus.Confirming));
  }, [dispatch]);

  useEffect(() => {
    setThemeMode('light');
  }, [setThemeMode]);

  useEffect(() => {
    (async () => {
      const { accessToken } = await getTokens();

      if (accessToken) {
        getFirebaseDeviceToken();

        dispatch(getProfileInfo());
        console.log('accessToken', accessToken);
        dispatch(getAllCurrentTickets());
        dispatch(setIsLoggedIn(true));

        dispatch(getOrUpdateZone());
      } else {
        dispatch(setIsLoggedIn(false));
      }
    })();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (locationLoaded) {
      dispatch(getOrUpdateZone());
      dispatch(getRecentDropoffs({ amount: 10 }));
    }
  }, [locationLoaded, dispatch]);

  useEffect(() => {
    updatePassengerState();
  }, [updatePassengerState]);

  useEffect(() => {
    if (defaultLocation && !locationLoaded) {
      setLocationLoaded(true);
    }
  }, [defaultLocation, locationLoaded]);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        const { accessToken } = await getTokens();
        if (accessToken) {
          console.log('accessToken', accessToken);

          dispatch(updateSignalRAccessToken(accessToken));
          dispatch(signalRThunks.connect());
          initializeSSEConnection(accessToken);
        }
      })();
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(updateProfileLanguage(i18n.language));
  }, [passengerZone, i18n.language, dispatch]);

  useEffect(() => {
    setupNotifications();
  }, [dispatch]);

  useEffect(() => {
    setIsServerErrorModalVisible(isErrorAvailable);
  }, [isErrorAvailable]);

  useEffect(() => {
    const changeOrderStateByCurrentOrder = (orderData: Nullable<OrderWithTariffInfo>) => {
      if (orderData === null && order) {
        switch (order.info?.state) {
          case 'MoveToPickUp':
          case 'InPickUp':
          case 'InPreviousOrder':
            //Because it can be changed in sse or notofications
            if (!isOrderCanceled) {
              dispatch(endTrip());

              //TODO: Rewrite with saving points on the device
              if (isCoordinatesEqualZero(offer.points[0]) || isCoordinatesEqualZero(offer.points[1])) {
                dispatch(setIsOrderCanceledAlertVisible(true));
                return;
              }

              dispatch(createInitialOffer());
              dispatch(setOrderStatus(OrderStatus.Confirming));
              dispatch(setIsOrderCanceled(true));
            }
            break;
          case 'InStopPoint':
          case 'MoveToDropOff':
          case 'MoveToStopPoint':
            dispatch(setTripIsCanceled(true));

            if (tripStatus === TripStatus.Finished || !order.info) {
              break;
            }

            dispatch(getOrderInfo(order.info.orderId));
            dispatch(setTripStatus(TripStatus.Finished));

            break;
          default:
            break;
        }
      }
    };

    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (!appState.current.match(/inactive|background/) && nextAppState !== 'active') {
        return;
      }

      if (!selectedOrderId && orderStatus === OrderStatus.Confirming) {
        const activeOffers = await dispatch(getActiveOffers()).unwrap();

        if (activeOffers.length === 0) {
          const orderData = await dispatch(getCurrentOrder()).unwrap();
          changeOrderStateByCurrentOrder(orderData);
        }
      } else if (selectedOrderId) {
        const orderData = await dispatch(getOrderInfo(selectedOrderId)).unwrap();

        if (order?.info?.state !== orderData.info?.state) {
          switch (orderData.info?.state) {
            case 'MoveToPickUp':
            case 'InPickUp':
            case 'MoveToStopPoint':
            case 'InStopPoint':
            case 'MoveToDropOff':
            case 'InPreviousOrder':
              dispatch(getRouteInfo(orderData.orderId));
              break;
            default:
              changeOrderStateByCurrentOrder(null);
              break;
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, isOrderCanceled, offer.points, order, tripStatus, selectedOrderId, orderStatus]);

  return (
    <>
      {children}
      {isServerErrorModalVisible && <ServerErrorModal setIsVisible={setIsServerErrorModalVisible} />}
    </>
  );
};

export default InitialSetup;
