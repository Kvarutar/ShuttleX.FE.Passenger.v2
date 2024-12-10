import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonShadows,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  CloseIcon,
  DislikeIcon,
  LikeIcon,
  SafeAreaView,
  SquareButtonModes,
  StatsBlock,
  Text,
  useTheme,
} from 'shuttlex-integration';
import { FeedbackRating } from 'shuttlex-integration/src/shared/screens/FeedbackScreen/props';

import imageBadAtmosphere from '../../../../assets/images/dislikeFeedback/imageBadAtmosphere';
import imageBadDriving from '../../../../assets/images/dislikeFeedback/imageBadDriving';
import imageDirtyCar from '../../../../assets/images/dislikeFeedback/ImageDirtyCar';
import imageRudeDriver from '../../../../assets/images/dislikeFeedback/imageRudeDriver';
import imageCleanCar from '../../../../assets/images/likeFeedback/imageCleanCar';
import imageFriendlyDriver from '../../../../assets/images/likeFeedback/imageFriendlyDriver';
import imageGoodDriving from '../../../../assets/images/likeFeedback/imageGoodDriving';
import imageNiceAtmosphere from '../../../../assets/images/likeFeedback/imageNiceAtmosphere';
import { useAppDispatch } from '../../../core/redux/hooks';
import { orderIdSelector, orderSelector } from '../../../core/ride/redux/trip/selectors';
import { sendFeedback } from '../../../core/ride/redux/trip/thunks';
import { RatingScreenProps } from './types';

const RatingScreen = ({ navigation }: RatingScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const orderInfo = useSelector(orderSelector);
  const orderId = useSelector(orderIdSelector);

  const [mark, setMark] = useState<FeedbackRating | null>(null);
  const [isMarkSelected, setIsMarkSelected] = useState(false);
  const [selectedSubMarks, setSelectedSubMarks] = useState<number[]>([]);

  const computedStyles = StyleSheet.create({
    text: {
      color: colors.textSecondaryColor,
    },
    subMarkText: {
      color: colors.textSecondaryColor,
    },
    subMarkImage: {
      borderColor: mark === 'like' ? colors.primaryColor : colors.errorColor,
    },
    subMarkIsNotSelected: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    confirmText: {
      color: mark ? colors.textPrimaryColor : colors.textQuadraticColor,
    },
  });

  const subMarksData: Record<FeedbackRating, { title: string; data: { image: ImageSourcePropType; text: string }[] }> =
    {
      dislike: {
        title: t('ride_Rating_dislikeTitle'),
        data: [
          {
            image: imageBadAtmosphere,
            text: t('ride_Rating_badAtmosphere'),
          },
          {
            image: imageRudeDriver,
            text: t('ride_Rating_rudeDriver'),
          },
          {
            image: imageBadDriving,
            text: t('ride_Rating_badDriving'),
          },
          {
            image: imageDirtyCar,
            text: t('ride_Rating_dirtyCar'),
          },
        ],
      },
      like: {
        title: t('ride_Rating_likeTitle'),
        data: [
          {
            image: imageNiceAtmosphere,
            text: t('ride_Rating_niceAtmosphere'),
          },
          {
            image: imageFriendlyDriver,
            text: t('ride_Rating_friendlyDriver'),
          },
          {
            image: imageGoodDriving,
            text: t('ride_Rating_goodDriving'),
          },
          {
            image: imageCleanCar,
            text: t('ride_Rating_cleanCar'),
          },
        ],
      },
    };

  const onSendFeedback = () => {
    if (mark) {
      setIsMarkSelected(true);
    }

    if (mark && isMarkSelected) {
      const selectedTitles = selectedSubMarks.map(index => subMarksData[mark].data[index].text.replace(/\n/g, ' '));

      if (orderId) {
        dispatch(
          sendFeedback({
            orderId: orderId,
            payload: {
              isLikedByPassenger: isMarkSelected,
              positiveFeedbacks: mark === 'like' ? selectedTitles : [],
              negativeFeedbacks: mark === 'dislike' ? selectedTitles : [],
            },
          }),
        );
      }
      navigation.navigate('Receipt');
    }
  };

  const onEndTrip = () => {
    navigation.navigate('Receipt');
  };

  const toggleIndex = (index: number) => () => {
    setSelectedSubMarks(prevSelectedIndices => {
      if (prevSelectedIndices.includes(index)) {
        return prevSelectedIndices.filter(i => i !== index);
      }

      return [...prevSelectedIndices, index];
    });
  };

  const markBlock = (
    <View style={styles.markWrapper}>
      {isMarkSelected && mark ? (
        <>
          <Text style={[styles.text, computedStyles.text]}>{t(subMarksData[mark].title)}</Text>
          <View style={styles.subMarkWrapper}>
            {subMarksData[mark].data.map((subMark, index) => (
              <Pressable style={styles.subMarkContainer} key={subMark.text} onPress={toggleIndex(index)}>
                <View>
                  <View
                    style={
                      !selectedSubMarks.includes(index)
                        ? [
                            styles.subMarkIsNotSelected,
                            computedStyles.subMarkIsNotSelected,
                            computedStyles.subMarkImage,
                          ]
                        : {}
                    }
                  />
                  <Image source={subMark.image} style={[styles.subMarkImage, computedStyles.subMarkImage]} />
                </View>
                <Text style={[styles.subMarkText, computedStyles.subMarkText]}>{subMark.text}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.text, computedStyles.text]}>
            {t('ride_Rating_willYouLike')}
            {/*TODO swap to contractor name*/}
            <Text style={[styles.text]}>{`${orderInfo?.info?.firstName}?`}</Text>
          </Text>
          <View style={styles.markContainer}>
            <Button
              shape={ButtonShapes.Circle}
              style={styles.markContainerStyle}
              mode={mark === 'dislike' ? CircleButtonModes.Mode3 : CircleButtonModes.Mode4}
              circleSubContainerStyle={styles.markCircleSubContainerStyle}
              onPress={() => setMark('dislike')}
            >
              <DislikeIcon color={mark === 'dislike' ? colors.iconTertiaryColor : undefined} />
            </Button>
            <Button
              shape={ButtonShapes.Circle}
              style={styles.markContainerStyle}
              mode={mark === 'like' ? CircleButtonModes.Mode5 : CircleButtonModes.Mode4}
              circleSubContainerStyle={styles.markCircleSubContainerStyle}
              onPress={() => setMark('like')}
            >
              <LikeIcon color={mark === 'like' ? colors.iconTertiaryColor : undefined} />
            </Button>
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView containerStyle={styles.container}>
      <View style={styles.feedback}>
        <Button shape={ButtonShapes.Circle} mode={CircleButtonModes.Mode2} onPress={onEndTrip}>
          <CloseIcon />
        </Button>
        <View style={styles.contentWrapper}>
          <View style={styles.riderInfoContainer}>
            {/* TODO: change to default avatar */}
            <Image style={styles.avatar} source={{ uri: orderInfo?.avatar ?? undefined }} />
            <Text style={[styles.text, styles.textName]}>{orderInfo?.info?.firstName}</Text>
            <StatsBlock
              amountLikes={orderInfo?.info?.totalLikesCount ?? 0}
              amountRides={orderInfo?.info?.totalRidesCount}
            />
          </View>
          {markBlock}
        </View>
        <Button
          containerStyle={styles.confirmButtonContainer}
          withCircleModeBorder
          shadow={ButtonShadows.Strong}
          shape={ButtonShapes.Circle}
          size={ButtonSizes.L}
          innerSpacing={8}
          onPress={onSendFeedback}
          text={t('ride_Rating_nextButton')}
          textStyle={[styles.confirmText, computedStyles.confirmText]}
          mode={mark ? SquareButtonModes.Mode1 : SquareButtonModes.Mode4}
          disabled={!mark}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  feedback: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  container: {
    flex: 1,
  },
  confirmButton: {
    borderWidth: 0,
  },
  riderInfoContainer: {
    alignItems: 'center',
  },
  avatar: {
    objectFit: 'contain',
    width: 102,
    height: 102,
    borderRadius: 100,
  },
  markWrapper: {
    alignItems: 'center',
  },
  markContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-evenly',
    marginTop: 38,
  },
  markContainerStyle: {
    width: 116,
    height: 116,
  },
  markCircleSubContainerStyle: {
    borderWidth: 0,
  },
  text: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 22,
  },
  textName: {
    marginTop: 26,
    marginBottom: 8,
  },
  subMarkWrapper: {
    flexDirection: 'row',
  },
  subMarkContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 32,
  },
  subMarkImage: {
    objectFit: 'contain',
    width: 73,
    height: 73,
    borderRadius: 100,
    borderWidth: 2.5,
  },
  subMarkText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter Medium',
    lineHeight: 17,
    marginTop: 16,
  },
  subMarkIsNotSelected: {
    opacity: 0.7,
    borderRadius: 100,
    borderWidth: 2.5,
    zIndex: 1,
    width: 73,
    height: 73,
    alignSelf: 'center',
    position: 'absolute',
  },
  confirmText: {
    fontFamily: 'Inter Bold',
    fontSize: 17,
  },
  confirmButtonContainer: {
    alignSelf: 'center',
  },
});

export default RatingScreen;
