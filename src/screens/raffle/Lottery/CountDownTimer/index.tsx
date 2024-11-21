import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { getLocales, getTimeZone } from 'react-native-localize';
import { useTheme } from 'shuttlex-integration';

import { getCurrentLottery } from '../../../../core/lottery/redux/thunks';
import { useAppDispatch } from '../../../../core/redux/hooks';
import { CountDownTimerProps } from './types';

const getTimeUntilNextLottery = (startDate: Date) => {
  const now = new Date();
  const nextLottery = new Date(startDate);

  const diffInSeconds = Math.floor((nextLottery.getTime() - now.getTime()) / 1000);
  return Math.max(diffInSeconds, 0);
};

const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000);
  return date
    .toLocaleString(getLocales()[0].languageTag, {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: getTimeZone(),
    })
    .replace(',', ':')
    .replace(/\s/g, '');
};

const CountdownTimer = ({ startDate }: CountDownTimerProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [countdown, setCountdown] = useState(getTimeUntilNextLottery(startDate));

  useEffect(() => {
    if (countdown <= 0) {
      dispatch(getCurrentLottery());
    }
  }, [countdown, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(_ => {
        const newCountdown = getTimeUntilNextLottery(startDate);
        if (newCountdown <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newCountdown;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [startDate]); //TODO: remove after network for test

  const computedStyles = StyleSheet.create({
    timerText: {
      color: colors.textSecondaryColor,
    },
    timer: {
      color: colors.textPrimaryColor,
    },
    timerLabel: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View style={styles.timerContainer}>
      <Text style={[styles.timerText, computedStyles.timerText]}>{t('raffle_Lottery_startThrough')}</Text>
      <Text style={[styles.timer, computedStyles.timer]}>{formatTime(countdown)}</Text>
      <View style={[styles.timerLabelContainer]}>
        <Text style={[styles.timerLabel, computedStyles.timerLabel]}>{t('raffle_Lottery_day')}</Text>
        <Text style={[styles.timerLabel, computedStyles.timerLabel]}>{t('raffle_Lottery_hour')}</Text>
        <Text style={[styles.timerLabel, computedStyles.timerLabel]}>{t('raffle_Lottery_minute')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  timerText: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  timer: {
    fontFamily: 'Inter Medium',
    fontSize: 52,
    lineHeight: 52,
    fontVariant: ['tabular-nums'],
  },
  timerLabelContainer: {
    width: 234,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  timerLabel: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    lineHeight: 14,
  },
});

export default CountdownTimer;
