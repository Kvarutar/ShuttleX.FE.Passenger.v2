import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import {
  Button,
  ButtonShapes,
  CameraIcon,
  CircleButtonModes,
  HeaderWithTwoTitles,
  ScrollViewWithCustomScroll,
  sizes,
  Text,
  TextInput,
  TextInputInputMode,
  useTheme,
} from 'shuttlex-integration';

import aipopup from '../../../../../../../assets/images/aipopup';
import FirstCard from './FirstCard';
import FourthCard from './FourthCard';
import SecondCard from './SecondCard';
import ThirdCard from './ThirdCard';
import { CardWrapperProps } from './types';

const iconWidth = 23;
const iconPaddingLeft = 14;

const AIPopup = ({ prefferedName }: { prefferedName?: string }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [searchBarHeight, setSearchBarHeight] = useState(0);
  const [searchData, setSearchData] = useState('');

  const onValueChange = (value: string) => {
    setSearchData(value);
  };

  const computedStyles = StyleSheet.create({
    container: {
      paddingBottom: searchBarHeight,
    },
    header: {
      color: colors.textQuadraticColor,
    },
    descript: {
      color: colors.textQuadraticColor,
    },
    barWrapper: {
      paddingHorizontal: sizes.paddingHorizontal,
      bottom: 0,
    },
    inputContainer: {
      paddingLeft: iconWidth + iconPaddingLeft + 8,
    },
    trueTypeIcon: {
      width: iconWidth,
      left: iconPaddingLeft,
    },
  });
  return (
    <>
      <ScrollViewWithCustomScroll contentContainerStyle={[styles.container, computedStyles.container]}>
        <View style={styles.wrapper}>
          <View style={styles.textContainer}>
            <Text style={[styles.header, computedStyles.header]}>{t('ride_AiPopup_header')}</Text>
            <Text style={styles.greeting}>{t('ride_AiPopup_greeting', { name: prefferedName })}</Text>
            <Text style={[styles.descript, computedStyles.descript]}>{t('ride_AiPopup_description')}</Text>
          </View>
          <View style={styles.cardWrapperContainer}>
            <CardWrapper
              firstTitle={t('ride_AiPopup_firstCard_header')}
              secondTitle={t('ride_AiPopup_firstCard_description')}
              children={<FirstCard />}
            />
            <CardWrapper
              firstTitle={t('ride_AiPopup_secondCard_header')}
              secondTitle={t('ride_AiPopup_secondCard_description')}
              children={<SecondCard />}
            />
            <CardWrapper
              firstTitle={t('ride_AiPopup_thirdCard_header')}
              secondTitle={t('ride_AiPopup_thirdCard_description')}
              children={<ThirdCard />}
            />
            <CardWrapper
              firstTitle={t('ride_AiPopup_fourthCard_header')}
              secondTitle={t('ride_AiPopup_fourthCard_description')}
              children={<FourthCard />}
            />
          </View>
        </View>
      </ScrollViewWithCustomScroll>

      <View
        style={[styles.barWrapper, computedStyles.barWrapper]}
        onLayout={event => setSearchBarHeight(event.nativeEvent.layout.height)}
      >
        <View style={styles.inputWrapper}>
          <Image source={aipopup.TrueTypeIcon} style={[styles.trueTypeIcon, computedStyles.trueTypeIcon]} />
          <TextInput
            maxLength={50}
            inputMode={TextInputInputMode.Search}
            value={searchData}
            placeholder={t('ride_AiPopup_searchBar')}
            withClearButton
            onChangeText={onValueChange}
            containerStyle={[styles.inputContainer, computedStyles.inputContainer]}
            inputStyle={styles.input}
          />
        </View>
        <Button mode={CircleButtonModes.Mode4} shape={ButtonShapes.Circle}>
          <CameraIcon style={styles.cameraIcon} />
        </Button>
        <Button mode={CircleButtonModes.Mode4} shape={ButtonShapes.Circle}>
          <Image source={aipopup.voiceImage} resizeMode="contain" style={styles.voiceIcon} />
        </Button>
      </View>
    </>
  );
};

const CardWrapper = ({ firstTitle, secondTitle, children }: CardWrapperProps) => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    firstCardTitle: {
      color: colors.textQuadraticColor,
    },
    secondCardTitle: {
      color: colors.textPrimaryColor,
    },
    cardWrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });
  return (
    <View style={[styles.cardWrapper, computedStyles.cardWrapper]}>
      <HeaderWithTwoTitles
        firstTitle={firstTitle}
        secondTitle={secondTitle}
        firstTextStyle={[styles.firstCardTitle, computedStyles.firstCardTitle]}
        secondTextStyle={[styles.secondCardTitle, computedStyles.secondCardTitle]}
      />
      <View style={styles.childrenWrapper}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: '#F7F6F7',
    alignItems: 'center',
  },
  wrapper: {
    gap: 15,
  },
  childrenWrapper: {
    alignItems: 'center',
  },
  cardWrapper: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    gap: 3,
    overflow: 'hidden',
    minWidth: 150,
  },
  cardWrapperContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  textContainer: {
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 60,
  },
  voiceIcon: {
    width: 36,
    height: 36,
  },
  image: {
    height: 'auto',
    width: 190,
    aspectRatio: 1,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Inter Bold',
    lineHeight: 32,
  },
  greeting: {
    fontSize: 40,
    fontFamily: 'Inter Bold',
    lineHeight: 42,
  },
  descript: {
    fontSize: 22,
    fontFamily: 'Inter Medium',
    lineHeight: 22,
    textAlign: 'center',
    paddingTop: 6,
  },
  firstCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter Bold',
    letterSpacing: 0,
  },
  secondCardTitle: {
    fontSize: 18,
    fontFamily: 'Inter Bold',
    lineHeight: 20,
    letterSpacing: 0,
    maxWidth: 120,
  },
  barWrapper: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#F7F6F7',
  },
  searchBarText: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
  },
  cameraIcon: {
    width: 23,
    height: 24,
  },
  input: {
    height: 56,
  },
  inputContainer: {
    borderRadius: 50,
    backgroundColor: '#F7F6F7',
  },
  inputWrapper: {
    flex: 1,
  },
  trueTypeIcon: {
    position: 'absolute',
    zIndex: 2,
    top: 16,
  },
});

export default AIPopup;
