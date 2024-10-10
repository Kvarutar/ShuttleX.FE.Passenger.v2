import { useNavigation, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  // TODO Uncomment all code whe we need it
  // GameIcon,
  MenuBase,
  MenuNavigation,
  // PlayIcon,
  PlusRoundIcon,
  sizes,
  // Text,
  // useTheme,
} from 'shuttlex-integration';

// import { View } from 'react-native';
import { RootStackParamList } from '../../../Navigate/props';
import { profileSelector } from './../../../core/redux/passenger/selectors';
import { MenuProps } from './props';

const Menu = ({ onClose }: MenuProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const profile = useSelector(profileSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const onCreateRide = () => {
    navigation.navigate('Ride', { openAddressSelect: true });
    onClose();
  };

  const menuNavigation: MenuNavigation = {
    ride: {
      navFunc: () => {
        navigation.navigate('Ride');
        onClose();
      },
      title: t('ride_Menu_navigationMyRide'),
      content: <CreateRide onClick={onCreateRide} />,
    },
    activity: {
      navFunc: () => {
        navigation.navigate('Activity');
        onClose();
      },
      title: t('ride_Menu_navigationActivity'),
    },
    wallet: {
      navFunc: () => {
        navigation.navigate('Wallet');
        onClose();
      },
      title: t('ride_Menu_navigationWallet'),
    },
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
        navigation.navigate('Wallet');
        //TODO go to page becomeDriver
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
        navigation.navigate('Wallet');
        //TODO Create help page
        onClose();
      },
      title: t('ride_Menu_navigationHelp'),
    },
  };
  return (
    <MenuBase
      onClose={onClose}
      userImageUri={profile?.imageUri ?? undefined}
      userName={profile?.fullName}
      menuNavigation={menuNavigation}
      // TODO Uncomment all code whe we need it
      // additionalButton={<PlayGameButton />}
      style={styles.menu}
      currentRoute={currentRoute}
    />
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

const CreateRide = ({ onClick }: { onClick: () => void }) => (
  <Pressable onPress={onClick}>
    <PlusRoundIcon />
  </Pressable>
);

const styles = StyleSheet.create({
  menu: {
    zIndex: 3,
  },
  itemsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  gameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  playGameText: {
    fontSize: 17,
    fontFamily: 'Inter Medium',
    lineHeight: 20.57,
  },
});

export default Menu;
