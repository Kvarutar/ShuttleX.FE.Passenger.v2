import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, useTheme } from 'shuttlex-integration';

import {
  imageAIAssistantBg,
  imageAIAssistantFirst,
  imageAIAssistantSecond,
  imageAIAssistantThird,
} from '../../../../../../../assets/images/startRide/ImagesAIAssistant';
import { profilePrefferedNameSelector } from '../../../../../../core/passenger/redux/selectors';
//TODO: Add this import when we need block "Bonuses"
//Removed in Task-418
//import imageBonuses from '../../../../../../../assets/images/startRide/imageBonusesBackground';
//Removed in Task-533
// import imageStartRideCarouselPrize from '../../../../../../../assets/images/startRide/imageStartRideCarouselPrize';
//TODO: Add this import when we need block "Support Ukraine"
//Removed in Task-418
//import imageUkraineHeart from '../../../../../../../assets/images/startRide/imageUkraineHeart';
//Removed in Task-533
//TODO: Add it when we need "Lottery"
// import { isLotteryLoadingSelector, lotteryStartTimeSelector } from '../../../../../../core/lottery/redux/selectors';
// import { RootStackParamList } from '../../../../../../Navigate/props';
import passengerColors from '../../../../../../shared/colors/colors';
//Removed in Task-533
// import usePrizeTimer from '../utils/usePrizeTimer';
import AdsBlock from './AdsBlock';
import { AdsBlockProps } from './AdsBlock/types';

const testData = {
  capiAmount: 16,
};

// const AdsButton = (props: ButtonProps) => {
//   return <Button textStyle={styles.buttonText} style={styles.button} {...props} />;
// };

const StartRideHidden = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  // const lotteryStartTime = useSelector(lotteryStartTimeSelector);
  // const { hours, minutes, seconds } = usePrizeTimer(new Date(lotteryStartTime ?? 0));
  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const isLotteryLoading = useSelector(isLotteryLoadingSelector);
  const prefferedName = useSelector(profilePrefferedNameSelector);

  //TODO: uncomment when we need seasons
  // const collectedCapiArr = Array.from({ length: Math.min(testData.capiAmount - 1, 4) });

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
    adsAITitle: {
      color: colors.textSecondaryColor,
    },
    adsAISubTitle: {
      color: colors.textPrimaryColor,
    },
    adsAISubTitleName: {
      color: colors.textSecondaryColor,
    },
    adsAIDescription: {
      color: colors.textSecondaryColor,
    },
    imageAIAssistantContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });

  //TODO: uncomment when we need seasons
  // const collectedCapiContent = collectedCapiArr.map((_, index) => {
  //   const collectedCapiBlockComputedStyles = StyleSheet.create({
  //     image: {
  //       zIndex: index,
  //     },
  //   });
  //
  //   return (
  //     <Image
  //       key={index}
  //       source={imageCollectCapybara}
  //       style={[styles.capiImage, styles.collectedCapiContent, collectedCapiBlockComputedStyles.image]}
  //     />
  //   );
  // });

  // Blocks are not removed by task condition
  // TODO: Remove or update this blocks when we decide what to do with it

  const adsInfoArray: AdsBlockProps[] = [
    {
      firstContent: (
        <>
          <View style={styles.adsAIContent}>
            <Text style={[styles.adsAITitle, computedStyles.adsAITitle]}>
              {t('ride_Ride_StartRideHidden_adsAIAssistantTitle')}
            </Text>
            <Text style={[styles.adsAISubTitle, computedStyles.adsAISubTitle]}>
              {t('ride_Ride_StartRideHidden_adsAIAssistantSubTitle')}
            </Text>
            {prefferedName && (
              <Text style={[styles.adsAISubTitle, computedStyles.adsAISubTitleName]}>{prefferedName}</Text>
            )}
            <View style={styles.textAndimagesAIAssistantContainer}>
              <Text style={[styles.adsAIDescription, computedStyles.adsAIDescription]}>
                {t('ride_Ride_StartRideHidden_adsAIAssistantDescription')}
              </Text>
              <View style={styles.imagesAIAssistantContainer}>
                <View
                  style={[
                    styles.imageAIAssistantContainer,
                    styles.imageAIAssistantContainerFirst,
                    computedStyles.imageAIAssistantContainer,
                  ]}
                >
                  <Image source={imageAIAssistantFirst} style={[styles.imageAIAssistant]} />
                </View>
                <View
                  style={[
                    styles.imageAIAssistantContainer,
                    styles.imageAIAssistantContainerSecond,
                    computedStyles.imageAIAssistantContainer,
                  ]}
                >
                  <Image source={imageAIAssistantSecond} style={[styles.imageAIAssistant]} />
                </View>
                <View
                  style={[
                    styles.imageAIAssistantContainer,
                    styles.imageAIAssistantContainerThird,
                    computedStyles.imageAIAssistantContainer,
                  ]}
                >
                  <Image source={imageAIAssistantThird} style={[styles.imageAIAssistant]} />
                </View>
              </View>
            </View>
          </View>
        </>
      ),
      firstImgUri: imageAIAssistantBg,
      containerStyle: {
        height: undefined,
        minHeight: 260,
      },
    },
    //Removed in Task-533
    //TODO: Add this block when we need "Lottery"
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
    // {
    //   firstContent: (
    //     <>
    //       <AdsContent>
    //         <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
    //           {t('ride_Ride_StartRideHidden_adsPrizes')}
    //         </Text>
    //         {isLotteryLoading ? (
    //           <Skeleton
    //             skeletonContainerStyle={styles.skeletonUpcomingLotteryStartTime}
    //             boneColor={passengerColors.lotteryColors.timeTextLoadingColor}
    //             highlightColor={passengerColors.adsBackgroundColor.whiteOpacityStrong}
    //           />
    //         ) : (
    //           <Text style={[styles.timeText, computedStyles.lotteryText]}>
    //             {`${hours}${t('ride_Ride_StartRide_hours')}:${minutes}${t('ride_Ride_StartRide_minutes')}:${seconds}${t('ride_Ride_StartRide_seconds')}`}
    //           </Text>
    //         )}
    //         <View style={styles.prizesButtonContainer}>
    //           <AdsButton
    //             text={t('ride_Ride_StartRideHidden_adsPrizesButtonStart')}
    //             onPress={() => navigation.navigate('Raffle')}
    //           />
    //           <View style={[styles.prizeBlock, computedStyles.prizeBlock]}>
    //             <Text style={[styles.buttonText, computedStyles.prizeBlockText]}>
    //               {t('ride_Ride_StartRideHidden_adsPrizesButtonWin')}
    //             </Text>
    //           </View>
    //         </View>
    //       </AdsContent>
    //       <Image source={imageStartRideCarouselPrize} style={styles.prizeImage} />
    //     </>
    //   ),
    //   firstImgUri: passengerColors.adsBackgroundColor.prize,
    // },
    //TODO: uncomment when we need seasons
    //TODO: add logic for navigation
    // {
    //   firstContent: (
    //     <>
    //       <AdsContent>
    //         <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
    //           {t('ride_Ride_StartRideHidden_adsFirstSeason')}
    //         </Text>
    //         <View style={styles.capiCollectWrapper}>
    //           <View style={styles.capiImageContainer}>
    //             <Image source={imageCollectCapybara} style={[styles.capiImage, computedStyles.capiImage]} />
    //             {collectedCapiContent}
    //           </View>
    //           <View style={[styles.capiAmountContainer, computedStyles.capiAmountContainer]}>
    //             <Text style={[styles.capiAmountText, computedStyles.capiAmountText]}>{testData.capiAmount}</Text>
    //           </View>
    //         </View>
    //         <Text style={[styles.collectText, computedStyles.lotteryText]}>
    //           {t('ride_Ride_StartRideHidden_adsFirstSeasonText')}
    //         </Text>
    //         <AdsButton text={t('ride_Ride_StartRideHidden_adsFirstSeasonButton')} />
    //       </AdsContent>
    //       <Image source={imageStartRideCarouselCapybara} style={styles.firstSeasonCapybaraImage} />
    //     </>
    //   ),
    //   firstImgUri: passengerColors.adsBackgroundColor.firstSeason,
    // },
    //TODO: Add this import when we need blocks "Bonuses" and Support Ukraine
    //Removed in Task-418
    // {
    //   bigImagePlace: 'right',
    //   firstContent: (
    //     <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsBonusesButton') }}>
    //       <Text style={[styles.textMediumSecond, styles.fontStyle, computedStyles.textColor]}>
    //         {t('ride_Ride_StartRideHidden_adsBonuses')}
    //       </Text>
    //     </AdsContent>
    //   ),
    //   firstImgUri: imageBonuses,
    //   secondContent: (
    //     <>
    //       <AdsContent
    //         style={styles.supportUkraineBlock}
    //         buttonProps={{ text: t('ride_Ride_StartRideHidden_adsSupportButton') }}
    //       >
    //         <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
    //           {t('ride_Ride_StartRideHidden_adsSupport')}
    //         </Text>
    //       </AdsContent>
    //       <Image source={imageUkraineHeart} style={styles.ukraineHeartImage} />
    //     </>
    //   ),
    //   secondImgUri: passengerColors.adsBackgroundColor.helpUkraine,
    // },
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
  skeletonUpcomingLotteryStartTime: {
    width: 150,
    height: 22,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 6,
  },
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
  adsAIContent: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: '3%',
  },
  adsAITitle: {
    alignSelf: 'center',
    fontFamily: 'Inter SemiBold',
    fontSize: 18,
    lineHeight: 32,
  },
  adsAISubTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Inter SemiBold',
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: 0,
  },
  adsAIDescription: {
    fontSize: 20,
    lineHeight: 22,
    marginTop: 14,
  },
  textAndimagesAIAssistantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagesAIAssistantContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 4,
  },
  imageAIAssistantContainer: {
    borderRadius: 10,
    width: '60%',
    aspectRatio: 1,
    padding: 2,
  },
  imageAIAssistant: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageAIAssistantContainerFirst: {
    transform: [{ rotate: '-10deg' }],
    left: '-10%',
  },
  imageAIAssistantContainerSecond: {
    transform: [{ rotate: '10deg' }],
    top: '-20%',
  },
  imageAIAssistantContainerThird: {
    top: '-35%',
    left: '-10%',
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
