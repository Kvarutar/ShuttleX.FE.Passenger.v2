import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
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
  Text,
} from 'shuttlex-integration';

import capyTicketWallet from '../../../../assets/images/capyTicketWallet';
import { ticketWalletTicketsSelector } from '../../../core/menu/redux/ticketWallet/selectors';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { cardColors } from './cardColors';
import { cardHeight } from './consts';
import TicketCard from './TicketCard';
import { TicketProps } from './types';

const windowHeight = Dimensions.get('window').height;

const TicketWalletScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { t } = useTranslation();
  const ticketNumbers = useSelector(ticketWalletTicketsSelector);
  const insets = useSafeAreaInsets();

  const computedStyles = StyleSheet.create({
    wrapper: {
      marginBottom: -insets.bottom,
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
        number: ticket.number,
        color: color,
        photo: getRandomItem(Object.values(capyTicketWallet)),
      });
    });

    return result;
  });

  const scrollY = useSharedValue(0);
  const activeCardIndex = useSharedValue(null);
  const [listHeight, setListHeight] = useState(0);
  const isScrollWorks = listHeight + cardHeight > windowHeight;

  const maxScrollY = isScrollWorks ? listHeight - windowHeight + cardHeight * 0.9 : 0;

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

  const onLotteryPress = () => {
    //TODO navigate to lottery page
  };

  return (
    <>
      <SafeAreaView containerStyle={[styles.wrapper, computedStyles.wrapper]}>
        <MenuHeader
          onMenuPress={() => setIsMenuVisible(true)}
          onNotificationPress={() => navigation.navigate('Notifications')}
          rightButton={
            <Button mode={CircleButtonModes.Mode2} shape={ButtonShapes.Circle} onPress={onLotteryPress}>
              <LotteryIcon style={styles.lotteryIcon} />
            </Button>
          }
        >
          <Text style={styles.textTitle}>{t('menu_TicketWallet_title')}</Text>
        </MenuHeader>

        <View style={styles.cardsWrapper}>
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
});
