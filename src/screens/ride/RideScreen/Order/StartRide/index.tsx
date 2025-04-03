import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Keyboard, Linking, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  BottomWindowWithGesture,
  BottomWindowWithGestureRef,
  Button,
  ButtonShapes,
  CarIcon,
  CircleButtonModes,
  EarthIcon,
  Nullable,
  PlayVideoIcon,
  Text,
  UnsupportedCityPopup,
  useTheme,
  WINDOW_HEIGHT,
} from 'shuttlex-integration';

import {
  setActiveBottomWindowYCoordinate,
  setSelectedStartRideBottomWindowMenuTabIdx,
} from '../../../../../core/passenger/redux';
import {
  profileSelector,
  selectedStartRideBottomWindowMenuTabIdxSelector,
} from '../../../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../../core/ride/redux/alerts/selectors';
import {
  cleanOfferPoints,
  setIsTooShortRouteLengthPopupVisible,
  setOfferRoute,
} from '../../../../../core/ride/redux/offer';
import { isRouteLengthTooShortError } from '../../../../../core/ride/redux/offer/errors';
import {
  isAllOfferPointsFilledSelector,
  isCityAvailableLoadingSelector,
  isCityAvailableSelector,
  isTooShortRouteLengthPopupVisibleSelector,
  offerPointsSelector,
  offerRecentDropoffsSelector,
  offerRouteErrorSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import { RecentDropoffsFromAPI } from '../../../../../core/ride/redux/offer/types';
import { setIsAddressSelectVisible } from '../../../../../core/ride/redux/order';
import { isOrderAddressSelectVisibleSelector } from '../../../../../core/ride/redux/order/selectors';
import { RootStackParamList } from '../../../../../Navigate/props';
import AlertInitializer from '../../../../../shared/AlertInitializer';
import passengerColors from '../../../../../shared/colors/colors';
import MapCameraModeButton from '../../MapCameraModeButton';
import AIPopup from '../../popups/AIPopup';
import UnsupportedDestinationPopup from '../../popups/UnsupportedDestinationPopup';
import TooShortRouteLengthPopup from '../popups/TooShortRouteLengthPopup';
import AddressSelect from './AddressSelect';
import CategoriesList from './CategoryList';
import EventsList, { bigEvents } from './EventList';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';
import { StartRideRef } from './types';

const animationDuration = 300;

const StartRide = forwardRef<StartRideRef>((_, ref) => {
  const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const isAddressSelectVisible = useSelector(isOrderAddressSelectVisibleSelector);
  const offerRouteError = useSelector(offerRouteErrorSelector);
  const isTooShortRouteLengthPopupVisible = useSelector(isTooShortRouteLengthPopupVisibleSelector);
  const profile = useSelector(profileSelector);
  const recentDropoffs = useSelector(offerRecentDropoffsSelector);
  const isAllOfferPointsFilled = useSelector(isAllOfferPointsFilledSelector);
  const offerPoints = useSelector(offerPointsSelector);
  const isCityAvailable = useSelector(isCityAvailableSelector);
  const isCityAvailableLoading = useSelector(isCityAvailableLoadingSelector);
  const selectedStartRideBottomWindowMenuTabIdx = useSelector(selectedStartRideBottomWindowMenuTabIdxSelector);

  const isRecentDropoffsExist = useMemo(() => recentDropoffs.length > 0, [recentDropoffs]);

  const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
  const [fastAddressSelect, setFastAddressSelect] = useState<Nullable<RecentDropoffsFromAPI>>(null);
  const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
  const [isUnsupportedDestinationPopupVisible, setIsUnsupportedDestinationPopupVisible] = useState<boolean>(false);
  const [isAiPopupVisible, setIsAiPopupVisible] = useState(false);

  const computedStyles = StyleSheet.create({
    navButtonsContainer: {
      bottom: insets.bottom === 0 ? (isRecentDropoffsExist ? WINDOW_HEIGHT * 0.03 : 0) : insets.bottom,
    },
    navButtonContainerStyle: {
      backgroundColor: passengerColors.adsBackgroundColor.navButton,
    },
    navBottomWindowButtonsContainer: {
      backgroundColor: passengerColors.adsBackgroundColor.navButton,
    },
    firstVisiblePartWrapper: {
      height: isBottomWindowOpen ? '100%' : 'auto', //TODO: think of clever way(problem is: i can't calculate visible part height in opened state before it's opened. This problem occure because of we don't use hidden part in this component and in opened state height of visible part lesser then 93% of widow height)
    },
    hiddenPartChange: {
      height: WINDOW_HEIGHT * 0.85,
    },
  });

  useImperativeHandle(ref, () => ({
    openAddressSelect: () => {
      dispatch(setIsAddressSelectVisible(true));
      addressSelectRef.current?.openWindow();
    },
  }));

  useEffect(() => {
    if (offerRouteError && isRouteLengthTooShortError(offerRouteError)) {
      dispatch(setIsTooShortRouteLengthPopupVisible(true));
    }
  }, [dispatch, offerRouteError]);

  useEffect(() => {
    if (isAddressSelectVisible) {
      addressSelectRef.current?.openWindow();
    } else {
      dispatch(cleanOfferPoints());
      setFastAddressSelect(null);
      dispatch(setOfferRoute(null));
    }
  }, [dispatch, offerPoints, isAddressSelectVisible]);

  useEffect(() => {
    if (isCityAvailable !== null && !isCityAvailableLoading && isAllOfferPointsFilled) {
      setIsUnsupportedCityPopupVisible(!isCityAvailable);
    }
  }, [isCityAvailable, isCityAvailableLoading, isAllOfferPointsFilled]);

  useEffect(() => {
    if (!isUnsupportedCityPopupVisible) {
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', Keyboard.dismiss);
    return keyboardDidShowListener.remove;
  }, [isUnsupportedCityPopupVisible]);

  const navBottomWindowButtonsIcons: (({ style }: { style?: StyleProp<ViewStyle> }) => JSX.Element)[] = [
    CarIcon,
    PlayVideoIcon,
    EarthIcon,
  ];

  const getBottomWindowProps = (): {
    visiblePart: ReactNode;
    minHeight: number;
  } => {
    switch (selectedStartRideBottomWindowMenuTabIdx) {
      case 0:
        return {
          visiblePart: (
            <View style={computedStyles.firstVisiblePartWrapper}>
              <StartRideVisible isBottomWindowOpen={isBottomWindowOpen} setFastAddressSelect={setFastAddressSelect} />
              <ScrollView>
                <StartRideHidden />
              </ScrollView>
            </View>
          ),
          minHeight: isRecentDropoffsExist ? 0.3 : 0.23 + insets.bottom / WINDOW_HEIGHT,
        };
      case 1:
        return {
          visiblePart: <></>,
          minHeight: 0,
        };
      case 2:
        return {
          visiblePart: (
            <Animated.View
              style={computedStyles.firstVisiblePartWrapper}
              entering={FadeIn.duration(animationDuration)}
              exiting={FadeOut.duration(animationDuration)}
            >
              <CategoriesList />
              <EventsList isBottomWindowOpen={isBottomWindowOpen} />
              {!isBottomWindowOpen && (
                <Animated.View style={[styles.bigEventImagesContainer]}>
                  <View style={styles.bigCard}>
                    <Image source={bigEvents[0]} style={styles.bigEventImage} />
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          ),
          minHeight: 0.4,
        };
      default:
        return {
          visiblePart: <></>,
          minHeight: 0,
        };
    }
  };

  const { minHeight, visiblePart } = getBottomWindowProps();

  return (
    <>
      <BottomWindowWithGesture
        ref={bottomWindowRef}
        maxHeight={0.6}
        minHeight={minHeight}
        onAnimationEnd={values => dispatch(setActiveBottomWindowYCoordinate(values.pageY))}
        onHiddenOrVisibleHeightChange={values => {
          if (!values.isWindowAnimating) {
            dispatch(setActiveBottomWindowYCoordinate(values.pageY));
          }
        }}
        visiblePart={visiblePart}
        setIsOpened={setIsBottomWindowOpen}
        additionalTopContent={<MapCameraModeButton />}
        alerts={alerts.map(alertData => (
          <AlertInitializer
            key={alertData.id}
            id={alertData.id}
            priority={alertData.priority}
            type={alertData.type}
            options={'options' in alertData ? alertData.options : undefined}
          />
        ))}
      />
      <View style={[styles.navButtonsContainer, computedStyles.navButtonsContainer]}>
        <Button
          shape={ButtonShapes.Circle}
          mode={CircleButtonModes.Mode4}
          containerStyle={[styles.navButtonContainerStyle, computedStyles.navButtonContainerStyle]}
          style={styles.navButtonStyle}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <Image
            style={styles.avatar}
            source={
              profile?.avatars[0]
                ? { uri: profile.avatars[0].value }
                : require('../../../../../../assets/images/DefaultAvatar.png')
            }
          />
        </Button>
        <View style={[styles.navBottomWindowButtonsContainer, computedStyles.navBottomWindowButtonsContainer]}>
          {navBottomWindowButtonsIcons.map((NavBottomWindowButtonIcon, index) => {
            return (
              <Button
                key={`navBottomWindowButtonIcon_${index}`}
                containerStyle={[
                  styles.navBottomWindowButtonContainerStyle,
                  {
                    backgroundColor: colors.squareButtonModes.mode5.backgroundColor,
                  },
                ]}
                style={[
                  styles.navBottomWindowButtonStyle,
                  {
                    backgroundColor:
                      selectedStartRideBottomWindowMenuTabIdx === index
                        ? colors.secondaryGradientStartColor
                        : undefined,
                  },
                ]}
                onPress={() => {
                  bottomWindowRef.current?.closeWindow();
                  if (index === 1) {
                    navigation.navigate('VideosScreen');
                  } else {
                    dispatch(setSelectedStartRideBottomWindowMenuTabIdx(index));
                  }
                }}
              >
                <NavBottomWindowButtonIcon />
              </Button>
            );
          })}
        </View>
        <Button
          shape={ButtonShapes.Circle}
          mode={CircleButtonModes.Mode4}
          containerStyle={[styles.navButtonContainerStyle, computedStyles.navButtonContainerStyle]}
          style={styles.navButtonStyle}
          onPress={() => {
            bottomWindowRef.current?.closeWindow();
            setIsAiPopupVisible(true);
          }}
        >
          <Text style={styles.AIButtonTextStyle}>{t('ride_Ride_StartRide_navButtonAI')}</Text>
        </Button>
      </View>
      {isAddressSelectVisible && (
        <BottomWindowWithGesture
          hiddenPart={
            <AddressSelect
              address={fastAddressSelect}
              setIsAddressSelectVisible={newState => dispatch(setIsAddressSelectVisible(newState))}
              setIsUnsupportedDestinationPopupVisible={setIsUnsupportedDestinationPopupVisible}
            />
          }
          setIsOpened={newState => dispatch(setIsAddressSelectVisible(newState))}
          ref={addressSelectRef}
          hiddenPartStyle={styles.hiddenPartStyleAddressSelect}
          hiddenPartWrapperStyle={styles.hiddenPartWrapper}
          withHiddenPartScroll={false}
        />
      )}
      {isUnsupportedCityPopupVisible && (
        <UnsupportedCityPopup
          onSupportPressHandler={() => Linking.openURL('https://t.me/ShuttleX_Support')}
          setIsUnsupportedCityPopupVisible={setIsUnsupportedCityPopupVisible}
        />
      )}
      {isUnsupportedDestinationPopupVisible && (
        <UnsupportedDestinationPopup
          setIsUnsupportedDestinationPopupVisible={setIsUnsupportedDestinationPopupVisible}
        />
      )}
      {isTooShortRouteLengthPopupVisible && <TooShortRouteLengthPopup />}

      {isAiPopupVisible && (
        <BottomWindowWithGesture
          setIsOpened={setIsAiPopupVisible}
          opened
          hiddenPart={<AIPopup prefferedName={profile?.names[0].value} />}
          hiddenPartStyle={computedStyles.hiddenPartChange}
          bottomWindowStyle={styles.bottomWindowBackground}
          hiddenPartContainerStyle={styles.hiddenPartContainerStyle}
          headerWrapperStyle={styles.bottomWindowBackground}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  hiddenPartStyleAddressSelect: {
    height: '100%',
    marginTop: 6,
  },
  hiddenPartWrapper: {
    paddingBottom: 0,
  },
  hiddenPartContainerStyle: {
    flex: 1,
  },
  bottomWindowBackground: {
    backgroundColor: '#F7F6F7',
  },
  navButtonsContainer: {
    position: 'absolute',
    gap: 8,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    height: 54,
  },
  navButtonContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    aspectRatio: 1,
    borderRadius: 100,
  },
  navButtonStyle: {
    height: 48,
    aspectRatio: 1,
  },
  navBottomWindowButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 4,
  },
  navBottomWindowButtonContainerStyle: {
    flex: 1,
    padding: 2,
    borderRadius: 24,
  },
  navBottomWindowButtonStyle: {
    borderRadius: 24,
    height: '100%',
  },
  AIButtonTextStyle: {
    fontSize: 18,
    lineHeight: 32,
  },
  avatar: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  bigEventImagesContainer: {
    gap: 10,
  },
  bigCard: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bigEventImage: {
    width: '100%',
    height: '100%',
  },
});

export default StartRide;
