import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { defaultShadow, Text, useTheme } from 'shuttlex-integration';

import { cardHeight, cardOverlap } from './consts';
import { useTicketAnimation } from './hooks/useTicketAnimation';
import { TicketCardProps } from './types';

const TicketCard = ({ ticket, index, scrollY, activeCardIndex }: TicketCardProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const translateY = useTicketAnimation(index, scrollY, activeCardIndex);

  const computedStyles = StyleSheet.create({
    card: {
      height: cardHeight,
      shadowColor: colors.iconPrimaryColor,
      backgroundColor: ticket.color,
      marginBottom: cardOverlap,
    },
  });

  const tap = Gesture.Tap().onEnd(() => {
    activeCardIndex.value = activeCardIndex.value === null ? index : null;
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        <Shadow {...defaultShadow(colors.strongShadowColor)} style={styles.shadow}>
          <View style={[styles.card, computedStyles.card]}>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>{t('menu_TicketWallet_numberTitle')}</Text>
              <Text style={styles.number}>{ticket.number}</Text>
            </View>
            <Image source={ticket.photo} style={styles.image} resizeMode="contain" />
          </View>
        </Shadow>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 19,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'stretch',
  },
  textWrapper: {
    gap: 4,
  },
  shadow: {
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 14,
    lineHeight: 16.94,
    opacity: 0.5,
    marginTop: 6,
  },
  number: {
    fontSize: 38,
    fontFamily: 'Inter SemiBold',
    letterSpacing: -2,
  },
  image: {
    height: 174,
    width: undefined,
    aspectRatio: 0.8,
    position: 'absolute',
    top: 10,
    right: 0,
  },
});

export default TicketCard;
