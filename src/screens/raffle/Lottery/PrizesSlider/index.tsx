import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { InputXIcon, SafeAreaView, Text, useTheme } from 'shuttlex-integration';

import { Prize } from '../../../../core/lottery/redux/types';
import passengerColors from '../../../../shared/colors/colors.ts';
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

  const renderItem = useCallback(
    ({ item }: { item: Prize }) => {
      const feKey = item.prizes[0].feKey;
      return (
        <View style={[styles.item, computedStyles.item]} onLayout={e => setItemHeight(e.nativeEvent.layout.height)}>
          <Image source={prizesData[feKey].image} style={styles.itemImage} />
          <Text style={[styles.itemPosition, computedStyles.itemPosition]}>
            {t('raffle_Lottery_PrizesSlider_position', { pos: item.index + 1 })}
          </Text>
          <Text style={styles.itemTitle}>{t(prizesData[feKey].name)}</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={[styles.itemDescription, computedStyles.itemDescription]}>
              {t(prizesData[feKey].description ?? '')}
            </Text>
          </ScrollView>
        </View>
      );
    },
    [computedStyles.item, computedStyles.itemDescription, computedStyles.itemPosition, t],
  );

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <SafeAreaView withTransparentBackground>
            <SmallButton icon={<InputXIcon color={computedStyles.icon.color} />} onPress={onClose} />
          </SafeAreaView>
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
    backgroundColor: passengerColors.raffle.surpriseTitleBackgroundColor,
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
  scrollView: {
    maxHeight: 60,
  },
});

export default PrizesSlider;
