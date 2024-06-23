import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { BottomWindowWithGesture, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { endTrip } from '../../../../core/ride/redux/trip';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Trip = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <BottomWindowWithGesture
      visiblePart={<VisiblePart />}
      hiddenPart={<HiddenPart />}
      hiddenPartContainerStyles={styles.container}
      hiddenPartButton={
        <SwipeButton
          mode={SwipeButtonModes.Decline}
          onSwipeEnd={() => dispatch(endTrip())}
          text={t('ride_Ride_Trip_cancelRideButton')}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});

export default Trip;
