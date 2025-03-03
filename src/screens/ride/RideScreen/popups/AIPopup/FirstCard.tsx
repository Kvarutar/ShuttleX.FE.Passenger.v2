import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { HomeIcon, Text, useTheme, WorkIcon } from 'shuttlex-integration';

import aipopup from '../../../../../../assets/images/aipopup';

const FirstCard = () => {
  const [cardSize, setCardSize] = useState({ width: 100, height: 100 });
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    tagWrapper: {
      backgroundColor: colors.chat.cardsBackgroundColor,
    },
  });
  return (
    <View
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setCardSize({ width, height });
      }}
    >
      <View style={[styles.tagWrapper, styles.homeTagPosition, computedStyles.tagWrapper]}>
        <HomeIcon />
        <Text style={styles.tagStyle}>{t('ride_AiPopup_firstCard_tagText')}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={aipopup.dmapImage} style={styles.image} />
      </View>
      <View style={[styles.tagWrapper, styles.workTagPosition, computedStyles.tagWrapper]}>
        <WorkIcon />
        <Text style={styles.tagStyle}>{t('ride_AiPopup_firstCard_secondTagText')}</Text>
      </View>
      <Svg height="100%" width="100%" viewBox={`0 0 ${cardSize.width} ${cardSize.height}`} style={styles.line}>
        <Line
          x1={cardSize.width * 0.18}
          y1={cardSize.height * 0.45}
          x2={cardSize.width * 0.2}
          y2={cardSize.height * 0.1}
          stroke={colors.chat.strokeColor}
          strokeWidth="3"
          strokeDasharray="5,5"
        />
        <Line
          x1={cardSize.width * 0.18}
          y1={cardSize.height * 0.45}
          x2={cardSize.width * 0.8}
          y2={cardSize.height * 0.8}
          stroke={colors.chat.strokeColor}
          strokeWidth="3"
          strokeDasharray="5,5"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 6,
    borderRadius: 10,
    position: 'absolute',
    zIndex: 2,
    alignContent: 'center',
  },
  homeTagPosition: {
    top: '10%',
  },
  workTagPosition: {
    bottom: '10%',
    right: 0,
  },
  homeIcon: {
    width: 16,
    height: 14,
  },
  workIcon: {
    width: 16,
    height: 16,
  },
  imageContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  image: {
    width: '150%',
    height: '150%',
    resizeMode: 'cover',
    transform: [{ rotate: '-2deg' }],
  },
  tagStyle: {
    fontSize: 13,
    fontFamily: 'Inter Medium',
    letterSpacing: 0,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  line: {
    position: 'absolute',
  },
});

export default FirstCard;
