//TODO uncoment code when we'll need other payment methods and wallet
//TODO: fix casting with "as"
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { Easing, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  ArrowIcon,
  Bar,
  BottomWindow,
  Button,
  ButtonShapes,
  ButtonSizes,
  ClockIcon2,
  DatePickerPopup,
  formatDate,
  formatTime,
  getCurrencySign,
  PaymentBar,
  // PaymentMethod,
  sizes,
  Text,
  useTariffsIcons,
  useTheme,
} from 'shuttlex-integration';
import { BottomWindowRef } from 'shuttlex-integration/lib/typescript/src/shared/molecules/BottomWindow/props';
import { CurrencyType } from 'shuttlex-integration/lib/typescript/src/utils/currency/types';

import { logger } from '../../../../../App';
import { useMap } from '../../../../../core/map/mapContext';
import { setActiveBottomWindowYCoordinate } from '../../../../../core/passenger/redux';
import { activeBottomWindowYCoordinateSelector } from '../../../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../../../core/redux/hooks';
import { setMapCars } from '../../../../../core/ride/redux/map';
import { setIsTooManyRidesPopupVisible } from '../../../../../core/ride/redux/offer';
import { isTooManyActiveRidesError } from '../../../../../core/ride/redux/offer/errors';
import {
  isOfferCreateLoadingSelector,
  offerCreateErrorSelector,
  offerSelector,
} from '../../../../../core/ride/redux/offer/selectors';
import { createInitialOffer } from '../../../../../core/ride/redux/offer/thunks';
import { setOrderStatus } from '../../../../../core/ride/redux/order';
import { OrderStatus } from '../../../../../core/ride/redux/order/types';
import PlanButton from '../../PlanButton/PlanButton';
import { checkPaymentStatus, PaymentStatusAPIResponse } from '../handlePayments';
import { DefaultPaymentMethodsType } from '../types';

export type PaymentStatus = PaymentStatusAPIResponse['status'] | 'pending';

const testPaymentMethods: { method: DefaultPaymentMethodsType; details: string; expiresAt: string }[] = [
  {
    method: 'cash',
    details: '',
    expiresAt: '',
  },
  // {
  //   method: 'card',
  //   details: '',
  //   expiresAt: '',
  // },
  // {
  //   method: 'visa',
  //   details: '2131',
  //   expiresAt: '',
  // },
  // {
  //   method: 'applepay',
  //   details: '',
  //   expiresAt: '',
  // },
  // {
  //   method: 'paypal',
  //   details: '',
  //   expiresAt: '',
  // },
  // {
  //   method: 'crypto',
  //   details: '',
  //   expiresAt: '',
  // },
];

// const testPlans: Matching[] = [
//   {
//     algorythm: 'Eager Fast',
//     durationSec: 100,
//   },
//   {
//     algorythm: 'Hungarian',
//     durationSec: 200,
//   },
//   {
//     algorythm: 'Eager Cheap',
//     durationSec: 300,
//   },
// ];

// const testAddPaymentMethods: PaymentMethod[] = [
//   {
//     method: 'card',
//     details: '',
//     expiresAt: '',
//   },
// ];

// const defaultPaymentMethods = ['cash', 'applepay', 'paypal', 'crypto'];
const defaultPaymentMethods = ['cash', 'card', 'crypto'];

const animationDuration = 200;

const PaymentPopup = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const tariffIconsData = useTariffsIcons();
  const { t } = useTranslation();
  const { fitToPolyline } = useMap();

  const bottomWindowRef = useRef<BottomWindowRef>(null);

  const { points, selectedTariff, estimatedPrice } = useSelector(offerSelector);
  const isOfferCreateLoading = useSelector(isOfferCreateLoadingSelector);
  const offerCreateError = useSelector(offerCreateErrorSelector);
  const activeBottomWindowYCoordinate = useSelector(activeBottomWindowYCoordinateSelector);

  const TariffIcon = selectedTariff ? tariffIconsData[selectedTariff.name].icon : null;
  const availableTestPlans = selectedTariff ? selectedTariff.matching.filter(item => item.durationSec !== null) : null;

  //TODO: Add setWindowIsOpened to useState when add new payment methods
  // Changed in Task-385
  const [windowIsOpened] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(availableTestPlans && availableTestPlans.length > 1 ? 1 : 0);
  const [selectedDate, setSelectedDate] = useState({ date: new Date(), time: new Date() });
  const [selectedPayment, setSelectedPayment] = useState<DefaultPaymentMethodsType>('cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [dateTimeTitle, setDateTimeTitle] = useState(t('ride_Ride_PaymentPopup_defaultTime'));
  //const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const computedStyles = StyleSheet.create({
    wrapper: {
      //TODO: Add this style when add new payment methods
      // Changed in Task-385
      // marginBottom: 56,
    },
    pickUpPointText: {
      color: colors.textTitleColor,
    },
    infoTopText: {
      color: colors.textQuadraticColor,
    },
    dateTimeTopText: {
      color: colors.textQuadraticColor,
    },
    dateTimeCloseButton: {
      backgroundColor: colors.errorColorWithOpacity,
    },
    dateTimeButton: {
      borderColor: dateTimeTitle === t('ride_Ride_PaymentPopup_defaultTime') ? colors.borderColor : colors.primaryColor,
      backgroundColor:
        dateTimeTitle === t('ride_Ride_PaymentPopup_defaultTime')
          ? colors.backgroundPrimaryColor
          : colors.primaryColorWithOpacity,
    },
    scrollViewWrapper: {
      height: windowIsOpened ? '100%' : 'auto', //TODO: think of clever way(problem is: i can't calculate visible part height in opened state before it's opened. This problem occure because of we don't use hidden part in this component and in opened state height of visible part lesser then 93% of widow height)
    },
    scrollView: {
      marginRight: windowIsOpened ? 0 : -sizes.paddingHorizontal,
      marginBottom: 0,
    },
    addMethodLabel: {
      color: colors.textSecondaryColor,
    },
  });

  useEffect(() => {
    if (activeBottomWindowYCoordinate !== null) {
      fitToPolyline();
    }
  }, [fitToPolyline, activeBottomWindowYCoordinate]);

  useEffect(() => {
    if (!isOfferCreateLoading) {
      if (paymentStatus === 'success' && !offerCreateError) {
        dispatch(setMapCars([]));
        dispatch(setOrderStatus(OrderStatus.Confirming));
      }
      // Add other errors handling if need
      else if (offerCreateError && isTooManyActiveRidesError(offerCreateError)) {
        dispatch(setIsTooManyRidesPopupVisible(true));
      }
    }
  }, [dispatch, paymentStatus, offerCreateError, isOfferCreateLoading]);

  useEffect(() => {
    setTimeout(() => {
      bottomWindowRef.current?.measure((_, __, ___, ____, _____, pageY) => {
        dispatch(setActiveBottomWindowYCoordinate(pageY));
      });
    }, 0);
  }, [dispatch]);

  useMemo(() => {
    const now = new Date();
    const isToday = selectedDate.date.toDateString() === now.toDateString();
    const diffMinutes = (selectedDate.time.getTime() - now.getTime()) / 60000;

    if (isToday && diffMinutes < 3) {
      setDateTimeTitle(t('ride_Ride_PaymentPopup_defaultTime'));
    } else {
      setDateTimeTitle(`${formatTime(selectedDate.time)} ${formatDate(selectedDate.date, 'weekday')}`);
    }
  }, [selectedDate.date, selectedDate.time, t]);

  if (TariffIcon && availableTestPlans) {
    //TODO: rewrite this logic after we connect payment
    const onConfirmPress = async () => {
      const paymentId = '3456677'; //TODO: get to know from where I can get it?
      // const price = planPriceCounting(
      //   Number(availableTestPlans[selectedPlan].durationSec),
      //   availableTestPlans[selectedPlan].algorythm,
      // );

      switch (selectedPayment) {
        case 'cash':
          await dispatch(createInitialOffer());
          setPaymentStatus('success');
          break;
        case 'card':
          //await handleMonoPayment({ amount: price, setPaymentUrl });
          break;
        case 'crypto':
          //await handleBinancePayment({ amount: price, setPaymentUrl });
          break;
        default:
          logger.error('Unknown payment method', selectedPayment);
          return;
      }

      if (selectedPayment !== 'cash') {
        try {
          const status: PaymentStatus = await checkPaymentStatus(paymentId);
          setPaymentStatus(status);
        } catch (error) {
          setPaymentStatus('failed');
        }
      }
    };

    const reorderPaymentMethods = (selectedMethod: string) => {
      const updatedMethods = testPaymentMethods.filter(method => method.method !== selectedMethod);
      const selectedPaymentMethod = testPaymentMethods.find(method => method.method === selectedMethod);
      if (selectedPaymentMethod) {
        updatedMethods.unshift(selectedPaymentMethod);
      }

      return updatedMethods;
    };

    const paymentTitle: Record<DefaultPaymentMethodsType, string> = {
      cash: t('ride_Ride_PaymentPopup_cash'),
      // applepay: t('ride_Ride_PaymentPopup_applepay'),
      // paypal: t('ride_Ride_PaymentPopup_paypal'),
      crypto: t('ride_Ride_PaymentPopup_crypto'),
      card: t('ride_Ride_PaymentPopup_card'),
    };

    const selectedPaymentType = defaultPaymentMethods.includes(selectedPayment) ? selectedPayment : 'card';

    const infoText = [
      {
        title: t('ride_Ride_PaymentPopup_payTitle'),
        value: paymentTitle[selectedPaymentType],
      },
      {
        title: t('ride_Ride_PaymentPopup_priceTitle'),
        value: `${getCurrencySign((estimatedPrice?.currencyCode as CurrencyType) ?? 'UAH')}${estimatedPrice?.value ?? 0}`,
      },
      {
        title: t('ride_Ride_PaymentPopup_timeTitle'),
        value: dateTimeTitle,
      },
    ];

    const infoTextBlock = ({ topText, bottomText }: { topText: string; bottomText: string }) => (
      <View key={`info_text_${topText}`} style={styles.infoTextContainer}>
        <Text style={[styles.infoTopText, computedStyles.infoTopText]}>{topText}</Text>
        <Animated.Text layout={FadeIn.duration(500)} numberOfLines={1} style={styles.infoBottomText}>
          {bottomText}
        </Animated.Text>
      </View>
    );

    const content = (
      <View style={[computedStyles.wrapper, styles.wrapper]}>
        <View>
          <View style={styles.addressTitleContainer}>
            <Text style={[styles.pickUpPointText, computedStyles.pickUpPointText]}>
              {t('ride_Ride_PaymentPopup_pickUpPoint')}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {points[0].address.length ? points[0].address : points[0].fullAddress}
            </Text>
          </View>
        </View>
        {!windowIsOpened && availableTestPlans.length !== 1 && (
          <Animated.View
            style={styles.plansContainer}
            entering={FadeIn.duration(animationDuration)}
            exiting={FadeOut.duration(animationDuration)}
          >
            {availableTestPlans.map((plan, index) => (
              <PlanButton
                plan={plan}
                key={index}
                withTimeShow={false}
                onPress={() => setSelectedPlan(index)}
                isSelected={selectedPlan === index}
              />
            ))}
          </Animated.View>
        )}

        <Animated.View style={[styles.scrollViewWrapper, computedStyles.scrollViewWrapper]} layout={FadeIn}>
          {testPaymentMethods.length > 1 ? (
            <ScrollView
              horizontal={!windowIsOpened}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={computedStyles.scrollView}
              contentContainerStyle={styles.scrollViewContainerStyle}
            >
              <>
                {reorderPaymentMethods(selectedPayment).map(method => (
                  //TODO: change method.details in key to card number
                  <Animated.View
                    key={`${method.method}_${method.details}`}
                    layout={LinearTransition.easing(Easing.ease).duration(200)}
                  >
                    <PaymentBar
                      method={method}
                      title={paymentTitle[method.method]}
                      squareShape={!windowIsOpened}
                      onPress={() => setSelectedPayment(method.method)}
                      selected={method.method === selectedPayment}
                    />
                  </Animated.View>
                ))}
                {/* {windowIsOpened && (
              <View>
                <Text style={[styles.addMethodLabel, computedStyles.addMethodLabel]}>
                  {t('ride_Ride_PaymentPopup_addPaymentMethod')}
                </Text>
                {testAddPaymentMethods.map((method, index) => (
                  <PaymentBar
                    key={index}
                    method={method}
                    title={paymentTitle[method.method as DefaultPaymentMethodsType]}
                    style={computedStyles.paymentBar}
                    addMethodStyle
                  />
                ))}
              </View>
            )} */}
              </>
            </ScrollView>
          ) : (
            <Animated.View
              key={`${testPaymentMethods[0].method}_${testPaymentMethods[0].details}`}
              layout={LinearTransition.easing(Easing.ease).duration(200)}
            >
              <PaymentBar
                style={styles.paymentBar}
                method={testPaymentMethods[0]}
                title={paymentTitle[testPaymentMethods[0].method]}
                squareShape={!windowIsOpened}
                onPress={() => setSelectedPayment(testPaymentMethods[0].method)}
                selected={testPaymentMethods[0].method === selectedPayment}
              />
            </Animated.View>
          )}
        </Animated.View>
        <View style={styles.infoWrapper}>
          <View style={styles.buttonContainer}>
            <Bar style={styles.button} onPress={() => dispatch(setOrderStatus(OrderStatus.ChoosingTariff))}>
              <ArrowIcon style={styles.arrowIcon} />
            </Bar>
            <Button
              isLoading={isOfferCreateLoading}
              shape={ButtonShapes.Circle}
              size={ButtonSizes.L}
              innerSpacing={8}
              text={t('ride_Ride_PaymentPopup_confirmButton')}
              onPress={onConfirmPress}
            />

            {/*TODO: remove comments when we will need a planed trip */}
            <Bar
              style={[styles.button, computedStyles.dateTimeButton]}
              // onPress={() => setIsDatePickerVisible(true)}
            >
              <ClockIcon2
                color={
                  // dateTimeTitle === t('ride_Ride_PaymentPopup_defaultTime')
                  //   ? colors.iconPrimaryColor
                  //   : colors.iconSuccessColor
                  colors.borderColor
                }
              />
              {dateTimeTitle !== t('ride_Ride_PaymentPopup_defaultTime') && <View style={styles.dateSelectedCircle} />}
            </Bar>
          </View>
          <View style={styles.infoContainer}>
            {infoText.map(info => infoTextBlock({ topText: info.title, bottomText: info.value.toString() }))}
          </View>
        </View>
      </View>
    );

    return (
      <>
        {/* {paymentUrl ? (
        <WebView
          source={{ uri: paymentUrl }}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color={colors.primaryColor} />}
        />
      ) : (
        <BottomWindowWithGesture
          maxHeight={0.82}
          setIsOpened={setWindowIsOpened}
          visiblePart={content}
          visiblePartStyle={styles.visiblePartStyles}
          headerWrapperStyle={styles.headerWrapperStyle}
          headerElement={<TariffIcon style={styles.image} />}
        />
      )} */}

        {/* TODO: Add this BottomWindowWithGesture and remove BottomWindow when add new payment methods
      Сhanged in the Task-385 */}
        {/* <BottomWindowWithGesture
        maxHeight={0.62}
        setIsOpened={setWindowIsOpened}
        visiblePart={content}
        visiblePartStyle={styles.visiblePartStyles}
        headerWrapperStyle={styles.headerWrapperStyle}
        headerElement={<TariffIcon style={styles.image} />}
      /> */}
        <BottomWindow ref={bottomWindowRef}>
          <TariffIcon style={styles.image} />
          {content}
        </BottomWindow>

        {isDatePickerVisible && (
          <DatePickerPopup
            isVisible={isDatePickerVisible}
            onVisibilityChange={setIsDatePickerVisible}
            onDateSelected={setSelectedDate}
          />
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flexShrink: 1,
  },
  visiblePartStyles: {
    flexShrink: 1,
  },
  headerWrapperStyle: {
    height: 40,
    justifyContent: 'flex-end',
  },
  image: {
    width: '80%',
    alignSelf: 'center',
    height: undefined,
    aspectRatio: 3,
    resizeMode: 'contain',
    position: 'absolute',
    top: -72,
  },
  addressTitleContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 16,
  },
  pickUpPointText: {
    fontFamily: 'Inter Medium',
  },
  addressText: {
    fontFamily: 'Inter Medium',
    fontSize: 21,
    lineHeight: 32,
  },
  infoWrapper: {
    paddingTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  arrowIcon: {
    transform: [{ rotate: '180deg' }],
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  infoTextContainer: {
    alignItems: 'center',
    flex: 1,
  },
  paymentBar: {
    width: '100%',
  },
  infoTopText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 16,
  },
  infoBottomText: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
    lineHeight: 18,
  },
  scrollViewWrapper: {
    flexShrink: 1,
  },
  scrollViewContainerStyle: {
    gap: 8,
  },
  addMethodLabel: {
    fontSize: 14,
    fontFamily: 'Inter Medium',
    marginBottom: 12,
    marginTop: 8,
  },
  dateSelectedCircle: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: 'black',
    position: 'absolute',
    top: 4,
    right: 4,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
});

export default PaymentPopup;
