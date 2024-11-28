import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture, BottomWindowWithGestureRef } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../../core/ride/redux/alerts/selectors';
import { SearchAddressFromAPI } from '../../../../../core/ride/redux/offer/types';
import AlertInitializer from '../../../../../shared/AlertInitializer';
import AddressSelect from './AddressSelect';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';
import { StartRideProps, StartRideRef } from './types';

const StartRide = forwardRef<StartRideRef, StartRideProps>(
  ({ isAddressSelectVisible, setIsAddressSelectVisible }, ref) => {
    const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
    const dispatch = useAppDispatch();

    const alerts = useSelector(twoHighestPriorityAlertsSelector);

    const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
    const [fastAddressSelect, setFastAddressSelect] = useState<SearchAddressFromAPI | null>(null);

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
        //TODO: now offer poins are cleaning after we press green button in address select
        //dispatch(cleanOfferPoints());
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
          hiddenPartWrapperStyle={styles.hiddenPartWrapper}
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
            hiddenPartWrapperStyle={styles.hiddenPartWrapper}
            withHiddenPartScroll={false}
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
