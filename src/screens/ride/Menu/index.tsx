import { useNavigation, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  LotteryIcon,
  // TODO Uncomment all code whe we need it
  // GameIcon,
  MenuBase,
  MenuNavigation,
  PlusIcon,
  // PlayIcon,
  // PlusRoundIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { lotteryTicketsSelector } from '../../../core/lottery/redux/selectors';
import {
  isPassengerAvatarLoadingSelector,
  isPassengerInfoLoadingSelector,
  profilePrefferedNameSelector,
  profileSelectedPhotoSelector,
} from '../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { setOrderStatus } from '../../../core/ride/redux/order';
import { OrderStatus } from '../../../core/ride/redux/order/types';
import { endTrip } from '../../../core/ride/redux/trip';
import { selectedOrderIdSelector } from '../../../core/ride/redux/trip/selectors';
import { getOrderInfo, getRouteInfo } from '../../../core/ride/redux/trip/thunks';
import { RootStackParamList } from '../../../Navigate/props';
import { MenuProps } from './types';

const Menu = ({ onClose, isStatusBarTranslucent }: MenuProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const { colors } = useTheme();

  const dispatch = useAppDispatch();

  const prefferedName = useSelector(profilePrefferedNameSelector);
  const selectedPhoto = useSelector(profileSelectedPhotoSelector);
  const selectedOrderId = useSelector(selectedOrderIdSelector);

  const isPassengerInfoLoading = useSelector(isPassengerInfoLoadingSelector);
  const isPassengerAvatarLoading = useSelector(isPassengerAvatarLoadingSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const computedStyles = StyleSheet.create({
    createRideButton: {
      backgroundColor: colors.errorColor,
    },
  });

  const onCreateRide = () => {
    // Means order and other ride info cleaning
    dispatch(endTrip());
    dispatch(setOrderStatus(OrderStatus.StartRide));
    navigation.navigate('Ride', { openAddressSelect: true });
    onClose();
  };

  const menuNavigation: MenuNavigation = {
    ride: {
      navFunc: () => {
        if (selectedOrderId) {
          dispatch(getRouteInfo(selectedOrderId));
          dispatch(getOrderInfo(selectedOrderId));
        }
        navigation.navigate('Ride');
        onClose();
      },
      title: t('ride_Menu_navigationMyRide'),
      content: (
        <Pressable onPress={onCreateRide} style={[styles.createRideButton, computedStyles.createRideButton]}>
          <PlusIcon color={colors.iconTertiaryColor} style={styles.createRideIcon} />
        </Pressable>
      ),
    },
    activity: {
      navFunc: () => {
        navigation.navigate('Activity');
        onClose();
      },
      title: t('ride_Menu_navigationActivity'),
    },

    //We dont need this for now
    // wallet: {
    //   navFunc: () => {
    //     navigation.navigate('Wallet');
    //     onClose();
    //   },
    //   title: t('ride_Menu_navigationWallet'),
    // },

    // TODO Uncomment all code whe we need it
    // promocodes: {
    //   navFunc: () => {
    //     navigation.navigate('Wallet');
    //     //TODO Create Promocodes page
    //     onClose();
    //   },
    //   title: t('ride_Menu_navigationPromocodes'),
    // },
    becomeDriver: {
      navFunc: () => {
        Linking.openURL('https://www.shuttlex.com/contractor.html');
        onClose();
      },
      title: t('ride_Menu_navigationBecomeDriver'),
    },
    accountSettings: {
      navFunc: () => {
        navigation.navigate('AccountSettings');
        onClose();
      },
      title: t('ride_Menu_navigationAccountSettings'),
    },
    help: {
      navFunc: () => {
        Linking.openURL('https://t.me/ShuttleX_Support');
        onClose();
      },
      title: t('ride_Menu_navigationHelp'),
    },
  };
  return (
    <MenuBase
      onClose={onClose}
      userImageUri={selectedPhoto}
      userName={prefferedName}
      menuNavigation={menuNavigation}
      isStatusBarTranslucent={isStatusBarTranslucent}
      additionalButton={<TicketWalletButton onClose={onClose} />}
      style={styles.menu}
      currentRoute={currentRoute}
      loading={{
        avatar: isPassengerAvatarLoading,
        username: isPassengerInfoLoading,
      }}
    />
  );
};

const TicketWalletButton = ({ onClose }: { onClose: () => void }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const tickets = useSelector(lotteryTicketsSelector);

  const computedStyles = StyleSheet.create({
    additionalButton: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
  });
  return (
    <Pressable
      style={[computedStyles.additionalButton, styles.additionalButton]}
      onPress={() => {
        navigation.navigate('TicketWallet');
        onClose();
      }}
    >
      <View style={styles.itemsWrapper}>
        <LotteryIcon />
        <Text style={styles.additionalText}>{t('ride_Menu_ticketWallet')}</Text>
      </View>
      <Text style={styles.numberStyle}>{tickets.length}</Text>
    </Pressable>
  );
};

// TODO Uncomment all code whe we need it

// const PlayGameButton = () => {
//   const { t } = useTranslation();
//   const { colors } = useTheme();

//   const onPlayGame = () => {
//     //TODO go to the game
//   };

//   const computedStyles = StyleSheet.create({
//     gameButton: {
//       backgroundColor: colors.backgroundSecondaryColor,
//     },
//   });
//   return (
//     <Pressable style={[computedStyles.gameButton, styles.gameButton]} onPress={onPlayGame}>
//       <View style={styles.itemsWrapper}>
//         <GameIcon />
//         <Text style={styles.playGameText}>{t('ride_Menu_playGameButton')}</Text>
//       </View>
//       <PlayIcon />
//     </Pressable>
//   );
// };

// const CreateRide = ({ onClick }: { onClick: () => void }) => (
//   <Pressable onPress={onClick}>
//     <PlusRoundIcon />
//   </Pressable>
// );

const styles = StyleSheet.create({
  menu: {
    zIndex: 3,
  },
  itemsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  additionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  additionalText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 20.57,
  },
  numberStyle: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    opacity: 0.4,
    lineHeight: 20.57,
    letterSpacing: -0.4,
  },
  createRideButton: {
    borderRadius: 100,
    width: 20,
    height: 20,
    padding: 6,
  },
  createRideIcon: {
    width: '100%',
    height: '100%',
  },
});

export default Menu;
