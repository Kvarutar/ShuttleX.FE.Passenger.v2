import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { InputXIcon, sizes, Text, useTheme } from 'shuttlex-integration';

import { Prize } from '../../../../core/lottery/redux/types';
import SmallButton from '../../SmallButton';
import { prizesData } from '../prizesData';
import { PrizesSliderProps } from './types';

const windowWidth = Dimensions.get('window').width;
const carouselAutoPlayInterval = 2000;

const PrizesSlider = memo(({ visible, onClose, selectedItemIndex, listItem }: PrizesSliderProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [itemHeight, setItemHeight] = useState<number>(0);

  const computedStyles = StyleSheet.create({
    wrapper: {
      transform: [{ translateY: -itemHeight / 2 }],
    },
    item: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    itemPosition: {
      color: colors.textSecondaryColor,
    },
    itemDescription: {
      color: colors.textSecondaryColor,
    },
    icon: {
      color: colors.iconPrimaryColor,
    },
  });

  //TODO: change prizes data with the real one
  const renderItem = useCallback(
    ({ item }: { item: Prize }) => {
      return (
        <View style={[styles.item, computedStyles.item]} onLayout={e => setItemHeight(e.nativeEvent.layout.height)}>
          <Image source={prizesData['iPhone 16'].image} style={styles.itemImage} />
          <Text style={[styles.itemPosition, computedStyles.itemPosition]}>
            {t('raffle_Lottery_PrizesSlider_position', { pos: item.index + 1 })}
          </Text>
          <Text style={styles.itemTitle}>{prizesData['iPhone 16'].name}</Text>
          <Text style={[styles.itemDescription, computedStyles.itemDescription]}>
            {prizesData['iPhone 16'].description}
          </Text>
        </View>
      );
    },
    [computedStyles.item, computedStyles.itemDescription, computedStyles.itemPosition, t],
  );

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <SmallButton icon={<InputXIcon color={computedStyles.icon.color} />} onPress={onClose} />
        </View>
      </TouchableWithoutFeedback>
      <View style={[styles.wrapper, computedStyles.wrapper]}>
        <Carousel
          width={windowWidth}
          height={itemHeight}
          vertical={false}
          loop={false}
          pagingEnabled={true}
          snapEnabled={true}
          autoPlayInterval={carouselAutoPlayInterval}
          data={listItem}
          renderItem={renderItem}
          defaultIndex={selectedItemIndex}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    paddingVertical: sizes.paddingVertical,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  wrapper: {
    position: 'absolute',
    top: '50%',
  },
  item: {
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  itemImage: {
    width: '100%',
    height: 271,
    resizeMode: 'contain',
    marginVertical: 40,
  },
  itemPosition: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    marginBottom: 16,
  },
  itemTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 24,
    lineHeight: 24,
    marginBottom: 16,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PrizesSlider;
