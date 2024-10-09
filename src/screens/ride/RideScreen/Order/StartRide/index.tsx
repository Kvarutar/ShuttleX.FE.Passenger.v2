import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture, BottomWindowWithGestureRef } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../../core/ride/redux/alerts/selectors';
import { cleanOrderPoints } from '../../../../../core/ride/redux/order';
import AlertInitializer from '../../../../../shared/AlertInitializer';
import { PlaceType } from '../PlaceBar/props';
import AddressSelect from './AddressSelect';
import { StartRideProps, StartRideRef } from './props';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';

const StartRide = forwardRef<StartRideRef, StartRideProps>(
  ({ isAddressSelectVisible, setIsAddressSelectVisible }, ref) => {
    const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
    const dispatch = useAppDispatch();

    const alerts = useSelector(twoHighestPriorityAlertsSelector);

    const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
    const [fastAddressSelect, setFastAddressSelect] = useState<PlaceType | null>(null);

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
        dispatch(cleanOrderPoints());
        setFastAddressSelect(null);
      }
    }, [dispatch, isAddressSelectVisible]);

    return (
      <>
        <BottomWindowWithGesture
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
          hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
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
              <AddressSelect setIsAddressSelectVisible={setIsAddressSelectVisible} address={fastAddressSelect} />
            }
            setIsOpened={setIsAddressSelectVisible}
            ref={addressSelectRef}
            hiddenPartStyle={styles.hiddenPartStyleAddressSelect}
            hiddenPartWrapperStyle={styles.hiddenPartWrapperAddressSelect}
            withHiddenPartScroll={false}
          />
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  hiddenPartStyle: {
    marginTop: 0,
  },
  hiddenPartContainerStyle: {
    paddingTop: 0,
  },
  hiddenPartStyleAddressSelect: {
    height: '100%',
  },
  hiddenPartWrapperAddressSelect: {
    paddingBottom: 0,
  },
});

export default StartRide;
