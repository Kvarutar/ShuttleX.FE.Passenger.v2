import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Keyboard,
  LayoutChangeEvent,
  Linking,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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
} from 'shuttlex-integration';

import { setActiveBottomWindowYCoordinate } from '../../../../../core/passenger/redux';
import { profileSelector } from '../../../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { twoHighestPriorityAlertsSelector } from '../../../../../core/ride/redux/alerts/selectors';
import { cleanOfferPoints, setIsTooShortRouteLengthPopupVisible } from '../../../../../core/ride/redux/offer';
import { isRouteLengthTooShortError } from '../../../../../core/ride/redux/offer/errors';
import {
  isCityAvailableLoadingSelector,
  isCityAvailableSelector,
  isTooShortRouteLengthPopupVisibleSelector,
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
import UnsupportedDestinationPopup from '../../popups/UnsupportedDestinationPopup';
import AIPopup from '../popups/AIPopup';
import TooShortRouteLengthPopup from '../popups/TooShortRouteLengthPopup';
import AddressSelect from './AddressSelect';
import CategoriesList from './CategoryList';
import EventsList, { bigEvents } from './EventList';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';
import { StartRideRef } from './types';

const windowHeight = Dimensions.get('window').height;

const animationDuration = 300;

const StartRide = forwardRef<StartRideRef>((_, ref) => {
  const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const bottomWindowRef = useRef<BottomWindowWithGestureRef>(null);

  const BWhiddenPartFirstHeightShared = useSharedValue(0);
  const BWhiddenPartSecondHeightShared = useSharedValue(0);

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const isCityAvailable = useSelector(isCityAvailableSelector);
  const isCityAvailableLoading = useSelector(isCityAvailableLoadingSelector);
  const isAddressSelectVisible = useSelector(isOrderAddressSelectVisibleSelector);
  const offerRouteError = useSelector(offerRouteErrorSelector);
  const isTooShortRouteLengthPopupVisible = useSelector(isTooShortRouteLengthPopupVisibleSelector);
  const profile = useSelector(profileSelector);
  const recentDropoffs = useSelector(offerRecentDropoffsSelector);

  const isRecentDropoffsExist = useMemo(() => recentDropoffs.length > 0, [recentDropoffs]);

  const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
  const [fastAddressSelect, setFastAddressSelect] = useState<Nullable<RecentDropoffsFromAPI>>(null);
  const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
  const [isUnsupportedDestinationPopupVisible, setIsUnsupportedDestinationPopupVisible] = useState<boolean>(false);
  const [selectedBottomWindowIdx, setSelectedBottomWindowIdx] = useState<number>(0);
  const [isAiPopupVisible, setIsAiPopupVisible] = useState(false);

  const computedStyles = StyleSheet.create({
    navButtonContainerStyle: {
      backgroundColor: passengerColors.adsBackgroundColor.navButton,
    },
    navBWButtonsContainer: {
      backgroundColor: passengerColors.adsBackgroundColor.navButton,
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
    }
  }, [dispatch, isAddressSelectVisible]);

  useEffect(() => {
    if (isCityAvailable !== null && !isCityAvailableLoading) {
      setIsUnsupportedCityPopupVisible(!isCityAvailable);
    }
  }, [isCityAvailable, isCityAvailableLoading]);

  useEffect(() => {
    if (!isUnsupportedCityPopupVisible) {
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', Keyboard.dismiss);
    return keyboardDidShowListener.remove;
  }, [isUnsupportedCityPopupVisible]);

  const navBWButtonsIcons: (({ style }: { style?: StyleProp<ViewStyle> }) => JSX.Element)[] = [
    CarIcon,
    PlayVideoIcon,
    EarthIcon,
  ];

  const onFakeHiddenPartFirstLayout = (e: LayoutChangeEvent) => {
    BWhiddenPartFirstHeightShared.value = e.nativeEvent.layout.height;
  };

  const onFakeHiddenPartSecondLayout = (e: LayoutChangeEvent) => {
    BWhiddenPartSecondHeightShared.value = e.nativeEvent.layout.height;
  };

  const fakeHiddenPartFirstAnimatedStyle = useAnimatedStyle(() => ({ height: BWhiddenPartFirstHeightShared.value }));
  const fakeHiddenPartSecondAnimatedStyle = useAnimatedStyle(() => ({ height: BWhiddenPartSecondHeightShared.value }));

  const getBottomWindowProps = (): {
    visiblePart: ReactNode;
    minHeight: number;
  } => {
    switch (selectedBottomWindowIdx) {
      case 0:
        return {
          visiblePart: (
            <>
              <StartRideVisible isBottomWindowOpen={isBottomWindowOpen} setFastAddressSelect={setFastAddressSelect} />
              <Animated.View style={fakeHiddenPartFirstAnimatedStyle}>
                <StartRideHidden onLayout={onFakeHiddenPartFirstLayout} />
              </Animated.View>
            </>
          ),
          minHeight: isRecentDropoffsExist ? 0.3 : 0.23,
        };
      case 1:
        return {
          visiblePart: <></>,
          minHeight: 0,
        };
      case 2:
        return {
          visiblePart: (
            <>
              <CategoriesList />
              <Animated.View
                entering={FadeIn.duration(animationDuration)}
                exiting={FadeOut.duration(animationDuration)}
              >
                <ScrollView
                  style={styles.secondBWScrollView}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={16}
                >
                  <EventsList />
                </ScrollView>
                <Animated.View style={[fakeHiddenPartSecondAnimatedStyle, styles.bigEventImagesContainer]}>
                  <View style={styles.bigCard} onLayout={onFakeHiddenPartSecondLayout}>
                    <Image source={bigEvents[0]} style={styles.bigEventImage} />
                  </View>
                  <View style={styles.bigCard} onLayout={onFakeHiddenPartSecondLayout}>
                    <Image source={bigEvents[1]} style={styles.bigEventImage} />
                  </View>
                </Animated.View>
              </Animated.View>
            </>
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
      <View style={styles.navButtonsContainer}>
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
        <View style={[styles.navBWButtonsContainer, computedStyles.navBWButtonsContainer]}>
          {navBWButtonsIcons.map((NavBWButtonIcon, index) => {
            const iconStyle = { opacity: index === 1 ? 0.3 : 1 };
            return (
              <Button
                key={`navBWButtonIcon_${index}`}
                //TODO: Remove condition when need play button
                disabled={index === 1}
                containerStyle={[
                  styles.navBWButtonContainerStyle,
                  {
                    //TODO: Remove condition when need play button
                    backgroundColor:
                      index === 1 ? colors.iconSecondaryColor : colors.squareButtonModes.mode5.backgroundColor,
                  },
                ]}
                style={[
                  styles.navBWButtonStyle,
                  {
                    backgroundColor: selectedBottomWindowIdx === index ? colors.secondaryGradientStartColor : undefined,
                  },
                ]}
                onPress={() => {
                  bottomWindowRef.current?.closeWindow();
                  setSelectedBottomWindowIdx(index);
                }}
              >
                {/* //TODO: Remove condition when need play button */}
                <NavBWButtonIcon style={iconStyle} />
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
          hiddenPartStyle={styles.hiddenPartChange}
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
  hiddenPartChange: {
    height: windowHeight * 0.85,
  },
  hiddenPartContainerStyle: {
    flex: 1,
  },
  bottomWindowBackground: {
    backgroundColor: '#F7F6F7',
  },
  navButtonsContainer: {
    position: 'absolute',
    bottom: 36,
    gap: 8,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%',
    height: 54,
  },
  navButtonContainerStyle: {
    padding: 4,
    height: '100%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  navButtonStyle: {
    height: '100%',
    aspectRatio: 1,
  },
  navBWButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 4,
  },
  navBWButtonContainerStyle: {
    flex: 1,
    padding: 2,
    borderRadius: 24,
  },
  navBWButtonStyle: {
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
  secondBWScrollView: {
    marginRight: -12,
  },
});

export default StartRide;
