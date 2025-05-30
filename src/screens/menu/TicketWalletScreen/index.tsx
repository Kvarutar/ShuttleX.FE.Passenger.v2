import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { cancelAnimation, clamp, useSharedValue, withDecay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShapes,
  CircleButtonModes,
  LotteryIcon,
  MenuHeader,
  SafeAreaView,
  sizes,
  Text,
  useTheme,
  WINDOW_HEIGHT,
} from 'shuttlex-integration';

import capyTicketWallet from '../../../../assets/images/capyTicketWallet';
import { lotteryTicketsSelector } from '../../../core/lottery/redux/selectors';
import { getAllCurrentTickets } from '../../../core/lottery/redux/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { cardColors } from './cardColors';
import { cardHeight } from './consts';
import TicketCard from './TicketCard';
import { TicketProps } from './types';

const TicketWalletScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { t } = useTranslation();
  const ticketNumbers = useSelector(lotteryTicketsSelector);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCurrentTickets());
  }, [dispatch]);

  const computedStyles = StyleSheet.create({
    wrapper: {
      marginBottom: -insets.bottom,
    },
    noTickets: {
      color: colors.textSecondaryColor,
    },
  });

  const getRandomItem = <T,>(arr: T[], excludeColor?: T | null): T => {
    const filteredArr = excludeColor ? arr.filter(item => item !== excludeColor) : arr;
    return filteredArr[Math.floor(Math.random() * filteredArr.length)];
  };

  const [tickets] = useState<TicketProps[]>(() => {
    const result: TicketProps[] = [];

    ticketNumbers.forEach((ticket, index) => {
      const prevColor = index > 0 ? result[index - 1].color : null;
      const color = getRandomItem(cardColors, prevColor);

      result.push({
        number: ticket.ticketNumber,
        color: color,
        photo: getRandomItem(Object.values(capyTicketWallet)),
      });
    });

    return result;
  });

  const scrollY = useSharedValue(0);
  const activeCardIndex = useSharedValue<number | null>(null);
  const [listHeight, setListHeight] = useState(0);
  const isScrollWorks = listHeight + cardHeight > WINDOW_HEIGHT;

  const maxScrollY = isScrollWorks ? listHeight - WINDOW_HEIGHT + cardHeight * 0.9 : 0;

  const pan = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(scrollY);
    })
    .onChange(event => {
      scrollY.value = clamp(scrollY.value - event.changeY, -cardHeight, maxScrollY);
    })
    .onEnd(event => {
      const currentScrollY = scrollY.value;
      const threshold = 20;

      // Check if scrollY is within the top or bottom threshold
      if (currentScrollY <= threshold) {
        scrollY.value = withTiming(0);
      } else if (currentScrollY >= maxScrollY - threshold) {
        scrollY.value = withTiming(maxScrollY);
      } else {
        scrollY.value = withDecay({
          velocity: -event.velocityY,
          clamp: [0, maxScrollY],
          velocityFactor: 0.7,
        });
      }
    });

  return (
    <>
      <SafeAreaView containerStyle={[styles.wrapper, computedStyles.wrapper]}>
        <MenuHeader
          onMenuPress={() => setIsMenuVisible(true)}
          rightButton={
            <Button
              mode={CircleButtonModes.Mode2}
              shape={ButtonShapes.Circle}
              onPress={() => navigation.navigate('Raffle')}
            >
              <LotteryIcon style={styles.lotteryIcon} />
            </Button>
          }
        >
          <Text style={styles.textTitle}>{t('menu_TicketWallet_title')}</Text>
        </MenuHeader>

        <View style={styles.cardsWrapper}>
          {tickets.length > 0 ? (
            <GestureDetector gesture={pan}>
              <View onLayout={event => setListHeight(event.nativeEvent.layout.height)}>
                {tickets.map((ticket, index) => (
                  <TicketCard
                    key={index}
                    ticket={ticket}
                    index={index}
                    scrollY={scrollY}
                    activeCardIndex={activeCardIndex}
                  />
                ))}
              </View>
            </GestureDetector>
          ) : (
            <View style={styles.noTicketsWrapper}>
              <Text style={[styles.noTickets, computedStyles.noTickets]}>{t('menu_TicketWallet_noTickets')}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

export default TicketWalletScreen;

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  wrapper: {
    gap: 13,
    paddingBottom: 0,
  },
  cardsWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  lotteryIcon: {
    width: 20,
    height: 18,
  },
  noTicketsWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: sizes.paddingHorizontal,
  },
  noTickets: {
    fontSize: 20,
    fontFamily: 'Inter Medium',
    textAlign: 'center',
  },
});
