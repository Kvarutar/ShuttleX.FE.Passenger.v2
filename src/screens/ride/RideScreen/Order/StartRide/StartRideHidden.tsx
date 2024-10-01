import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SquareButtonModes, Text, useTheme } from 'shuttlex-integration';

import imageAchievements from '../../../../../../assets/images/imageAchievements';
import imageBonuses from '../../../../../../assets/images/imageBonuses';
import imagePlayGame from '../../../../../../assets/images/imagePlayGame';
import imageSupportUkraine from '../../../../../../assets/images/imageSupportUkraine';
import AdsBlock from './AdsBlock';
import { AdsBlockProps } from './AdsBlock/types';
import AdsContent from './AdsContent';

const StartRideHidden = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    textColor: {
      color: colors.textTertiaryColor,
    },
    preferredCryptoSubText: {
      color: colors.textTitleColor,
    },
  });

  const adsInfoArray: AdsBlockProps[] = [
    {
      firstContent: (
        //TODO: add logic for navigation to game screeen
        <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsGame_button') }}>
          <Text style={[styles.textMedium, styles.fontStyle, computedStyles.textColor]}>
            {t('ride_Ride_StartRideHidden_adsGame')}
          </Text>
        </AdsContent>
      ),
      firstImgUri: imagePlayGame,
    },
    {
      bigImagePlace: 'right',
      firstContent: (
        <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsBonuses_button') }}>
          <Text style={[styles.textMediumSecond, styles.fontStyle, computedStyles.textColor]}>
            {t('ride_Ride_StartRideHidden_adsBonuses')}
          </Text>
        </AdsContent>
      ),
      firstImgUri: imageBonuses,
      secondContent: (
        <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsSupport_button') }}>
          <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
            {t('ride_Ride_StartRideHidden_adsSupport')}
          </Text>
        </AdsContent>
      ),
      secondImgUri: imageSupportUkraine,
    },
    // This block is not removed by task condition
    // TODO: Remove or update this block when we decide what to do with it
    // {
    //   bigImagePlace: 'left',
    //   firstContent: (
    //     <AdsContent buttonProps={{ text: t('ride_Ride_StartRideHidden_adsKryptobaraToken_button') }}>
    //       <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
    //         {t('ride_Ride_StartRideHidden_adsKryptobaraToken')}
    //       </Text>
    //     </AdsContent>
    //   ),
    //   firstImgUri: imageKryptobaraToken,
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
    //   secondImgUri: imagePreferredCrypto,
    // },
    {
      firstContent: (
        <AdsContent
          //TODO: add logic for navigation to achievements screeen
          buttonProps={{ text: t('ride_Ride_StartRideHidden_adsAchievements_button'), mode: SquareButtonModes.Mode2 }}
        >
          <Text style={[styles.textLarge, styles.fontStyle, computedStyles.textColor]}>
            {t('ride_Ride_StartRideHidden_adsAchievements')}
          </Text>
        </AdsContent>
      ),
      firstImgUri: imageAchievements,
      containerStyle: styles.achievementsContainer,
    },
  ];

  return (
    <View>
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
  textLarge: {
    fontSize: 32,
  },
  textMedium: {
    fontSize: 19,
  },
  textMediumSecond: {
    fontSize: 17,
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
});

export default StartRideHidden;
