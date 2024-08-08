import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomWindowWithGesture, SwipeButton, SwipeButtonModes } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../core/ride/redux/alerts/selectors';
import { endTrip } from '../../../../core/ride/redux/trip';
import AlertInitializer from '../../../../shared/AlertInitializer';
import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Trip = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const alerts = useSelector(twoHighestPriorityAlertsSelector);

  return (
    <BottomWindowWithGesture
      alerts={alerts.map(alertData => (
        <AlertInitializer
          key={alertData.id}
          id={alertData.id}
          priority={alertData.priority}
          type={alertData.type}
          options={'options' in alertData ? alertData.options : undefined}
        />
      ))}
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
