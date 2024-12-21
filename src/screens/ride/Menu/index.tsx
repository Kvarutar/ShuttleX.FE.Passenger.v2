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
import { RootStackParamList } from '../../../Navigate/props';
import { MenuProps } from './types';

const Menu = ({ onClose, isStatusBarTranslucent }: MenuProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const prefferedName = useSelector(profilePrefferedNameSelector);
  const selectedPhoto = useSelector(profileSelectedPhotoSelector);

  const isPassengerInfoLoading = useSelector(isPassengerInfoLoadingSelector);
  const isPassengerAvatarLoading = useSelector(isPassengerAvatarLoadingSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  //TODO uncoment all comments when we need this code
  // const onCreateRide = () => {
  //   navigation.navigate('Ride', { openAddressSelect: true });
  //   onClose();
  // };

  const menuNavigation: MenuNavigation = {
    ride: {
      navFunc: () => {
        navigation.navigate('Ride');
        onClose();
      },
      title: t('ride_Menu_navigationMyRide'),
      // content: <CreateRide onClick={onCreateRide} />,
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
});

export default Menu;
