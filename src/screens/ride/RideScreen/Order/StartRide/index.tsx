import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
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
import { cleanOfferPoints } from '../../../../../core/ride/redux/offer';
import {
  isCityAvailableLoadingSelector,
  isCityAvailableSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import { RecentDropoffsFromAPI } from '../../../../../core/ride/redux/offer/types';
import AlertInitializer from '../../../../../shared/AlertInitializer';
import MapCameraModeButton from '../../MapCameraModeButton';
import UnsupportedDestinationPopup from '../../popups/UnsupportedDestinationPopup';
import AddressSelect from './AddressSelect';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';
import { StartRideProps, StartRideRef } from './types';

const StartRide = forwardRef<StartRideRef, StartRideProps>(
  ({ isAddressSelectVisible, setIsAddressSelectVisible }, ref) => {
    const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
    const dispatch = useAppDispatch();

    const alerts = useSelector(twoHighestPriorityAlertsSelector);
    const isCityAvailable = useSelector(isCityAvailableSelector);
    const isCityAvailableLoading = useSelector(isCityAvailableLoadingSelector);

    const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
    const [fastAddressSelect, setFastAddressSelect] = useState<Nullable<RecentDropoffsFromAPI>>(null);
    const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
    const [isUnsupportedDestinationPopupVisible, setIsUnsupportedDestinationPopupVisible] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      openAddressSelect: () => {
        setIsAddressSelectVisible(true);
        addressSelectRef.current?.openWindow();
      },
    }));

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
          onGestureUpdate={callback => dispatch(setActiveBottomWindowYCoordinate(callback.y))}
          visiblePart={
            <StartRideVisible
              openAddressSelect={setIsAddressSelectVisible}
              isBottomWindowOpen={isBottomWindowOpen}
              setFastAddressSelect={setFastAddressSelect}
            />
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
                setIsAddressSelectVisible={setIsAddressSelectVisible}
                setIsUnsupportedDestinationPopupVisible={setIsUnsupportedDestinationPopupVisible}
              />
            }
            setIsOpened={setIsAddressSelectVisible}
            ref={addressSelectRef}
            hiddenPartStyle={styles.hiddenPartStyleAddressSelect}
            hiddenPartWrapperStyle={styles.hiddenPartWrapper}
            withHiddenPartScroll={false}
          />
        )}
        {isUnsupportedCityPopupVisible && (
          <UnsupportedCityPopup
            //TODO: swap console.log('Support') to navigation on Support
            onSupportPressHandler={() => console.log('Support')}
            setIsUnsupportedCityPopupVisible={setIsUnsupportedCityPopupVisible}
          />
        )}
        {isUnsupportedDestinationPopupVisible && (
          <UnsupportedDestinationPopup
            setIsUnsupportedDestinationPopupVisible={setIsUnsupportedDestinationPopupVisible}
          />
        )}
      </>
    );
  },
);

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
