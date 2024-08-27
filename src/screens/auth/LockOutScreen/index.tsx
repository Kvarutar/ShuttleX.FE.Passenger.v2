import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LockOutScreen as LockOutScreenIntegration, SafeAreaView } from 'shuttlex-integration';

import { selectLockoutEndTimestamp } from '../../../core/auth/redux/lockout/selectors';
import { LockOutScreenProps } from './props';

const LockOutScreen = ({ navigation }: LockOutScreenProps): JSX.Element => {
  const lockoutEndTimestamp = useSelector(selectLockoutEndTimestamp);
  const [isLockedOut, setIsLockedOut] = useState(true);

  useEffect(() => {
    // prevent the possibility of turning back while the timer is running
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (isLockedOut) {
        e.preventDefault();
      } else {
        navigation.dispatch(e.data.action);
      }
    });

    return unsubscribe;
  }, [navigation, isLockedOut]);

  const onAfterCountdownEnds = () => {
    setIsLockedOut(false);
  };

  const onContactSupport = () => {
    //TODO: send user to support
  };

  return (
    <SafeAreaView>
      <LockOutScreenIntegration
        lockoutEndTimestamp={lockoutEndTimestamp}
        onContactSupport={onContactSupport}
        onRequestCodeAgain={navigation.goBack}
        onAfterCountdownEnds={onAfterCountdownEnds}
        isLockedOut={isLockedOut}
      />
    </SafeAreaView>
  );
};

export default LockOutScreen;
