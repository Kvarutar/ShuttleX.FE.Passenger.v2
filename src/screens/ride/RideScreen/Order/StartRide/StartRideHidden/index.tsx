import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Button, ButtonProps, Text, useTheme } from 'shuttlex-integration';

import imageBonuses from '../../../../../../../assets/images/startRide/imageBonusesBackground';
import imageCollectCapybara from '../../../../../../../assets/images/startRide/imageCollectCapybara';
import imageStartRideCarouselCapybara from '../../../../../../../assets/images/startRide/imageStartRideCarouselCapybara';
import imageStartRideCarouselPrize from '../../../../../../../assets/images/startRide/imageStartRideCarouselPrize';
import imageUkraineHeart from '../../../../../../../assets/images/startRide/imageUkraineHeart';
import passengerColors from '../../../../../../shared/colors/colors';
import usePrizeTimer from '../utils/usePrizeTimer';
import AdsBlock from './AdsBlock';
import { AdsBlockProps } from './AdsBlock/types';
import AdsContent from './AdsContent';

const testData = {
  endTime: new Date(2024, 10, 1),
  capiAmount: 16,
};

const AdsButton = (props: ButtonProps) => {
  return <Button textStyle={styles.buttonText} style={styles.button} {...props} />;
};

const StartRideHidden = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { hours, minutes, seconds } = usePrizeTimer(testData.endTime);

  const collectedCapiArr = Array.from({ length: Math.min(testData.capiAmount - 1, 4) });

  const computedStyles = StyleSheet.create({
    textColor: {
      color: colors.textTertiaryColor,
    },
    preferredCryptoSubText: {
      color: colors.textTitleColor,
    },
    lotteryText: {
      color: passengerColors.lotteryColors.text,
    },
    prizeBlock: {
      backgroundColor: passengerColors.adsBackgroundColor.whiteOpacityStrong,
    },
    prizeBlockText: {
      color: colors.textTertiaryColor,
    },
    capiAmountContainer: {
      backgroundColor: testData.capiAmount ? colors.primaryColor : passengerColors.adsBackgroundColor.whiteOpacityLight,
    },
    capiAmountText: {
      color: testData.capiAmount ? colors.textPrimaryColor : colors.textTertiaryColor,
    },
    capiImage: {
      opacity: testData.capiAmount ? 1 : 0.2,
    },
  });

  const collectedCapiContent = collectedCapiArr.map((_, index) => {
    const collectedCapiBlockComputedStyles = StyleSheet.create({
      image: {
        zIndex: index,
      },
    });

    return (
      <Image
        key={index}
        source={imageCollectCapybara}
        style={[styles.capiImage, styles.collectedCapiContent, collectedCapiBlockComputedStyles.image]}
      />
    );
  });

  // Blocks are not removed by task condition
  // TODO: Remove or update this blocks when we decide what to do with it

  const adsInfoArray: AdsBlockProps[] = [
    // {
    //   firstContent: (
    //     //TODO: add logic for navigation to game screen
    //     <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsGameButton') }}>
    //       <Text style={[styles.textMedium, styles.fontStyle, computedStyles.textColor]}>
    //         {t('ride_Ride_StartRideHidden_adsGame')}
    //       </Text>
    //     </AdsContent>
    //   ),
    //   firstImgUri: imagePlayGameBackground,
    // },
    //TODO: add logic for navigation
    {
      firstContent: (
        <>
          <AdsContent>
            <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
              {t('ride_Ride_StartRideHidden_adsPrizes')}
            </Text>
            <Text style={[styles.timeText, computedStyles.lotteryText]}>
              {`${hours}${t('ride_Ride_StartRide_hours')}:${minutes}${t('ride_Ride_StartRide_minutes')}:${seconds}${t('ride_Ride_StartRide_seconds')}`}
            </Text>
            <View style={styles.prizesButtonContainer}>
              <AdsButton text={t('ride_Ride_StartRideHidden_adsPrizesButtonStart')} />
              <View style={[styles.prizeBlock, computedStyles.prizeBlock]}>
                <Text style={[styles.buttonText, computedStyles.prizeBlockText]}>
                  {t('ride_Ride_StartRideHidden_adsPrizesButtonWin')}
                </Text>
              </View>
            </View>
          </AdsContent>
          <Image source={imageStartRideCarouselPrize} style={styles.prizeImage} />
        </>
      ),
      firstImgUri: passengerColors.adsBackgroundColor.prize,
    },
    //TODO: add logic for navigation
    {
      firstContent: (
        <>
          <AdsContent>
            <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
              {t('ride_Ride_StartRideHidden_adsFirstSeason')}
            </Text>
            <View style={styles.capiCollectWrapper}>
              <View style={styles.capiImageContainer}>
                <Image source={imageCollectCapybara} style={[styles.capiImage, computedStyles.capiImage]} />
                {collectedCapiContent}
              </View>
              <View style={[styles.capiAmountContainer, computedStyles.capiAmountContainer]}>
                <Text style={[styles.capiAmountText, computedStyles.capiAmountText]}>{testData.capiAmount}</Text>
              </View>
            </View>
            <Text style={[styles.collectText, computedStyles.lotteryText]}>
              {t('ride_Ride_StartRideHidden_adsFirstSeasonText')}
            </Text>
            <AdsButton text={t('ride_Ride_StartRideHidden_adsFirstSeasonButton')} />
          </AdsContent>
          <Image source={imageStartRideCarouselCapybara} style={styles.firstSeasonCapybaraImage} />
        </>
      ),
      firstImgUri: passengerColors.adsBackgroundColor.firstSeason,
    },
    {
      bigImagePlace: 'right',
      firstContent: (
        <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsBonusesButton') }}>
          <Text style={[styles.textMediumSecond, styles.fontStyle, computedStyles.textColor]}>
            {t('ride_Ride_StartRideHidden_adsBonuses')}
          </Text>
        </AdsContent>
      ),
      firstImgUri: imageBonuses,
      secondContent: (
        <>
          <AdsContent
            style={styles.supportUkraineBlock}
            buttonProps={{ text: t('ride_Ride_StartRideHidden_adsSupportButton') }}
          >
            <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
              {t('ride_Ride_StartRideHidden_adsSupport')}
            </Text>
          </AdsContent>
          <Image source={imageUkraineHeart} style={styles.ukraineHeartImage} />
        </>
      ),
      secondImgUri: passengerColors.adsBackgroundColor.helpUkraine,
    },
    // {
    //   bigImagePlace: 'left',
    //   firstContent: (
    //     <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsKryptobaraTokenButton') }}>
    //       <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
    //         {t('ride_Ride_StartRideHidden_adsKryptobaraToken')}
    //       </Text>
    //     </AdsContent>
    //   ),
    //   firstImgUri: imageKryptobaraTokenBackground,
    //   secondContent: (
    //     <AdsContent>
    //       <View>
    //         <Text style={[styles.textSmall, styles.fontStyle, computedStyles.textColor]}>
    //           {t('ride_Ride_StartRideHidden_adsPreferred')}
    //         </Text>
    //         <Text style={[styles.textSmall, styles.fontStyle, computedStyles.preferredCryptoSubText]}>
    //           {t('ride_Ride_StartRideHidden_adsCrypto')}
    //         </Text>
    //       </View>
    //     </AdsContent>
    //   ),
    //   secondImgUri: imagePreferredCryptoBackground,
    // },
    // {
    //   firstContent: (
    //     <AdsContent
    //       //TODO: add logic for navigation to achievements screen
    //       buttonProps={{ text: t('ride_Ride_StartRideHidden_adsAchievementsButton'), mode: SquareButtonModes.Mode2 }}
    //     >
    //       <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
    //         {t('ride_Ride_StartRideHidden_adsAchievements')}
    //       </Text>
    //     </AdsContent>
    //   ),
    //   firstImgUri: imageAchievementsBackground,
    //   containerStyle: styles.achievementsContainer,
    // },
  ];

  return (
    <View style={styles.wrapper}>
      {adsInfoArray.map((item: AdsBlockProps, index: number) => (
        <AdsBlock
          key={`ads_${index}`}
          bigImagePlace={item.bigImagePlace || 'none'}
          firstContent={item.firstContent}
          firstImgUri={item.firstImgUri}
          secondContent={item?.secondContent}
          secondImgUri={item.secondImgUri}
          containerStyle={item.containerStyle}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 16,
  },
  textLarge: {
    fontSize: 32,
    lineHeight: 32,
  },
  textMedium: {
    fontSize: 19,
    lineHeight: 19,
  },
  textMediumSecond: {
    fontSize: 17,
    lineHeight: 17,
  },
  textSmall: {
    fontSize: 14,
  },
  fontStyle: {
    fontFamily: 'Inter Bold',
  },
  achievementsContainer: {
    height: 160,
  },
  supportUkraineBlock: {
    justifyContent: 'flex-start',
    gap: 20,
  },
  prizesButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    maxWidth: 95,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Inter Medium',
    fontSize: 11,
  },
  timeText: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
    marginBottom: 12,
    marginTop: 6,
  },
  collectText: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
    marginBottom: 10,
    marginTop: 20,
  },
  capiAmountContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capiAmountText: {
    fontFamily: 'Inter Bold',
    fontSize: 11,
  },
  capiCollectWrapper: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capiImage: {
    width: undefined,
    height: 33,
    aspectRatio: 1.2,
  },
  collectedCapiContent: {
    marginLeft: -18,
  },
  capiImageContainer: {
    flexDirection: 'row',
  },
  prizeBlock: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  prizeImage: {
    width: '85%',
    height: undefined,
    aspectRatio: 3.15,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  firstSeasonCapybaraImage: {
    width: undefined,
    height: 190,
    aspectRatio: 0.8,
    position: 'absolute',
    right: 10,
    top: 30,
  },
  ukraineHeartImage: {
    width: undefined,
    height: 160,
    aspectRatio: 1,
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
});

export default StartRideHidden;
