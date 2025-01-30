import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Keyboard, Linking, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Nullable,
  UnsupportedCityPopup,
} from 'shuttlex-integration';

import { setActiveBottomWindowYCoordinate } from '../../../../../core/passenger/redux';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../../core/ride/redux/alerts/selectors';
import { cleanOfferPoints, setIsTooShortRouteLengthPopupVisible } from '../../../../../core/ride/redux/offer';
import { isRouteLengthTooShortError } from '../../../../../core/ride/redux/offer/errors';
import {
  isCityAvailableLoadingSelector,
  isCityAvailableSelector,
  isTooShortRouteLengthPopupVisibleSelector,
  offerRoutesErrorSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import { RecentDropoffsFromAPI } from '../../../../../core/ride/redux/offer/types';
import { setIsAddressSelectVisible } from '../../../../../core/ride/redux/order';
import { isOrderAddressSelectVisibleSelector } from '../../../../../core/ride/redux/order/selectors';
import AlertInitializer from '../../../../../shared/AlertInitializer';
import MapCameraModeButton from '../../MapCameraModeButton';
import UnsupportedDestinationPopup from '../../popups/UnsupportedDestinationPopup';
import TooShortRouteLengthPopup from '../popups/TooShortRouteLengthPopup';
import AddressSelect from './AddressSelect';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';
import { StartRideRef } from './types';

const StartRide = forwardRef<StartRideRef>((_, ref) => {
  const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
  const dispatch = useAppDispatch();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const isCityAvailable = useSelector(isCityAvailableSelector);
  const isCityAvailableLoading = useSelector(isCityAvailableLoadingSelector);
  const isAddressSelectVisible = useSelector(isOrderAddressSelectVisibleSelector);
  const offerRoutesError = useSelector(offerRoutesErrorSelector);
  const isTooShortRouteLengthPopupVisible = useSelector(isTooShortRouteLengthPopupVisibleSelector);

  const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
  const [fastAddressSelect, setFastAddressSelect] = useState<Nullable<RecentDropoffsFromAPI>>(null);
  const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
  const [isUnsupportedDestinationPopupVisible, setIsUnsupportedDestinationPopupVisible] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    openAddressSelect: () => {
      dispatch(setIsAddressSelectVisible(true));
      addressSelectRef.current?.openWindow();
    },
  }));

  useEffect(() => {
    if (offerRoutesError && isRouteLengthTooShortError(offerRoutesError)) {
      dispatch(setIsTooShortRouteLengthPopupVisible(true));
    }
  }, [dispatch, offerRoutesError]);

  useEffect(() => {
    if (isAddressSelectVisible) {
      addressSelectRef.current?.openWindow();
    } else {
      dispatch(cleanOfferPoints());
      setFastAddressSelect(null);
    }
  }, [dispatch, isAddressSelectVisible]);

  useEffect(() => {
    if (isCityAvailable !== null && !isCityAvailableLoading) {
      setIsUnsupportedCityPopupVisible(!isCityAvailable);
    }
  }, [isCityAvailable, isCityAvailableLoading]);

  useEffect(() => {
    if (!isUnsupportedCityPopupVisible) {
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', Keyboard.dismiss);
    return keyboardDidShowListener.remove;
  }, [isUnsupportedCityPopupVisible]);

  return (
    <>
      <BottomWindowWithGesture
        onAnimationEnd={values => dispatch(setActiveBottomWindowYCoordinate(values.pageY))}
        onGestureStart={event => {
          if (event.velocityY > 0) {
            dispatch(setActiveBottomWindowYCoordinate(null));
          }
        }}
        onHiddenOrVisibleHeightChange={values => {
          if (!values.isWindowAnimating) {
            dispatch(setActiveBottomWindowYCoordinate(values.pageY));
          }
        }}
        visiblePart={
          <StartRideVisible isBottomWindowOpen={isBottomWindowOpen} setFastAddressSelect={setFastAddressSelect} />
        }
        setIsOpened={setIsBottomWindowOpen}
        hiddenPart={<StartRideHidden />}
        hiddenPartStyle={styles.hiddenPartStyle}
        hiddenPartWrapperStyle={styles.hiddenPartWrapper}
        additionalTopContent={<MapCameraModeButton />}
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
      />
      {isAddressSelectVisible && (
        <BottomWindowWithGesture
          hiddenPart={
            <AddressSelect
              address={fastAddressSelect}
              setIsAddressSelectVisible={newState => dispatch(setIsAddressSelectVisible(newState))}
              setIsUnsupportedDestinationPopupVisible={setIsUnsupportedDestinationPopupVisible}
            />
          }
          setIsOpened={newState => dispatch(setIsAddressSelectVisible(newState))}
          ref={addressSelectRef}
          hiddenPartStyle={styles.hiddenPartStyleAddressSelect}
          hiddenPartWrapperStyle={styles.hiddenPartWrapper}
          withHiddenPartScroll={false}
        />
      )}
      {isUnsupportedCityPopupVisible && (
        <UnsupportedCityPopup
          onSupportPressHandler={() => Linking.openURL('https://t.me/ShuttleX_Support')}
          setIsUnsupportedCityPopupVisible={setIsUnsupportedCityPopupVisible}
        />
      )}
      {isUnsupportedDestinationPopupVisible && (
        <UnsupportedDestinationPopup
          setIsUnsupportedDestinationPopupVisible={setIsUnsupportedDestinationPopupVisible}
        />
      )}
      {isTooShortRouteLengthPopupVisible && <TooShortRouteLengthPopup />}
    </>
  );
});

const styles = StyleSheet.create({
  hiddenPartStyleAddressSelect: {
    height: '100%',
    marginTop: 6,
  },
  hiddenPartWrapper: {
    paddingBottom: 0,
  },
  hiddenPartStyle: {
    marginTop: 0,
  },
});

export default StartRide;
