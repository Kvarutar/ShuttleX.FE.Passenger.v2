import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, HeaderWithTwoTitles, ScrollViewWithCustomScroll, Text, useTheme } from 'shuttlex-integration';

import { RootStackParamList } from '../../../../../Navigate/props';
import FirstCard from './FirstCard';
import FourthCard from './FourthCard';
import SecondCard from './SecondCard';
import ThirdCard from './ThirdCard';
import { CardWrapperProps } from './types';

const AIPopup = ({ prefferedName }: { prefferedName?: string }) => {
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'Ride'>['navigation']>();

  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    header: {
      color: colors.textQuadraticColor,
    },
    descript: {
      color: colors.textQuadraticColor,
    },
    container: {
      backgroundColor: colors.chat.popupBackgroundColor,
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

      <Button
        text={t('ride_AiPopup_button')}
        style={styles.chatButton}
        onPress={() => navigation.navigate('AiChatScreen')}
      />
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
  chatButton: { borderRadius: 50 },
});

export default AIPopup;
