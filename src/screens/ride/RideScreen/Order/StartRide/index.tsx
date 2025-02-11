import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Keyboard, LayoutChangeEvent, Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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
  offerRoutesErrorSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import { RecentDropoffsFromAPI } from '../../../../../core/ride/redux/offer/types';
import { setIsAddressSelectVisible } from '../../../../../core/ride/redux/order';
import { isOrderAddressSelectVisibleSelector } from '../../../../../core/ride/redux/order/selectors';
import { RootStackParamList } from '../../../../../Navigate/props';
import AlertInitializer from '../../../../../shared/AlertInitializer';
import passengerColors from '../../../../../shared/colors/colors';
import MapCameraModeButton from '../../MapCameraModeButton';
import UnsupportedDestinationPopup from '../../popups/UnsupportedDestinationPopup';
import TooShortRouteLengthPopup from '../popups/TooShortRouteLengthPopup';
import AddressSelect from './AddressSelect';
import StartRideHidden from './StartRideHidden';
import StartRideVisible from './StartRideVisible';
import { StartRideRef } from './types';

const StartRide = forwardRef<StartRideRef>((_, ref) => {
  const addressSelectRef = useRef<BottomWindowWithGestureRef>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const hiddenPartHeightShared = useSharedValue(0);

  const alerts = useSelector(twoHighestPriorityAlertsSelector);
  const isCityAvailable = useSelector(isCityAvailableSelector);
  const isCityAvailableLoading = useSelector(isCityAvailableLoadingSelector);
  const isAddressSelectVisible = useSelector(isOrderAddressSelectVisibleSelector);
  const offerRoutesError = useSelector(offerRoutesErrorSelector);
  const isTooShortRouteLengthPopupVisible = useSelector(isTooShortRouteLengthPopupVisibleSelector);
  const profile = useSelector(profileSelector);

  const [isBottomWindowOpen, setIsBottomWindowOpen] = useState(false);
  const [fastAddressSelect, setFastAddressSelect] = useState<Nullable<RecentDropoffsFromAPI>>(null);
  const [isUnsupportedCityPopupVisible, setIsUnsupportedCityPopupVisible] = useState<boolean>(false);
  const [isUnsupportedDestinationPopupVisible, setIsUnsupportedDestinationPopupVisible] = useState<boolean>(false);
  const [selectedBottomWindowIdx, setSelectedBottomWindowIdx] = useState<number>(0);

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
    if (offerRoutesError && isRouteLengthTooShortError(offerRoutesError)) {
      dispatch(setIsTooShortRouteLengthPopupVisible(true));
    }
  }, [dispatch, offerRoutesError]);

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

  const onFakeHiddenPartLayout = (e: LayoutChangeEvent) => {
    hiddenPartHeightShared.value = e.nativeEvent.layout.height / 2;
  };

  const fakeHiddenPartAnimatedStyle = useAnimatedStyle(() => ({ height: hiddenPartHeightShared.value }));

  //TODO: Add BottomWindows to other cases
  const renderCurrentBottomWindow = () => {
    switch (selectedBottomWindowIdx) {
      case 0:
      case 1:
      case 2:
      default:
        return (
          <BottomWindowWithGesture
            maxHeight={0.6}
            onAnimationEnd={values => dispatch(setActiveBottomWindowYCoordinate(values.pageY))}
            onGestureStart={event => {
              if (event.velocityY > 0) {
                dispatch(setActiveBottomWindowYCoordinate(null));
              }
            }}
            onHiddenOrVisibleHeightChange={values => {
              if (!values.isWindowAnimating) {
                dispatch(setActiveBottomWindowYCoordinate(values.pageY));
              }
            }}
            visiblePart={
              <>
                <StartRideVisible isBottomWindowOpen={isBottomWindowOpen} setFastAddressSelect={setFastAddressSelect} />
                {!isBottomWindowOpen && (
                  <Animated.View style={fakeHiddenPartAnimatedStyle}>
                    <StartRideHidden onLayout={onFakeHiddenPartLayout} />
                  </Animated.View>
                )}
              </>
            }
            setIsOpened={setIsBottomWindowOpen}
            hiddenPart={isBottomWindowOpen && <StartRideHidden />}
            hiddenPartStyle={styles.hiddenPartStyle}
            hiddenPartWrapperStyle={styles.hiddenPartWrapper}
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
        );
    }
  };

  return (
    <>
      {renderCurrentBottomWindow()}
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
                onPress={() => setSelectedBottomWindowIdx(index)}
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
          //TODO: Add navigation to the AI screen or add opening AI chat
          onPress={() => console.log('open AI BW or navigate to AI screen')}
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
  hiddenPartStyle: {
    marginTop: 0,
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
});

export default StartRide;
