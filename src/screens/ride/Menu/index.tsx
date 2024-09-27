import { useNavigationState } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  GameIcon,
  MenuBase,
  MenuNavigation,
  PlayIcon,
  PlusRoundIcon,
  sizes,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { profileSelector } from './../../../core/redux/passenger/selectors';
import { MenuProps } from './props';

const Menu = ({ onClose, navigation }: MenuProps) => {
  const { t } = useTranslation();
  const profile = useSelector(profileSelector);

  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const onCreateRide = () => {
    navigation.navigate('Ride');
    //TODO Send for create ride page
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
        navigation.navigate('Ride');
        //TODO Create activity page
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
    promocodes: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create Promocodes page
        onClose();
      },
      title: t('ride_Menu_navigationPromocodes'),
    },
    becomeDriver: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO go to page becomeDriver
        onClose();
      },
      title: t('ride_Menu_navigationBecomeDriver'),
    },
    settings: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create settings page
        onClose();
      },
      title: t('ride_Menu_navigationSettings'),
    },
    help: {
      navFunc: () => {
        navigation.navigate('Ride');
        //TODO Create help page
        onClose();
      },
      title: t('ride_Menu_navigationHelp'),
    },
  };
  return (
    <MenuBase
      onClose={onClose}
      userImageUri={profile?.imageUri}
      userName={profile?.name}
      userSurname={profile?.surname}
      menuNavigation={menuNavigation}
      additionalButton={<PlayGameButton />}
      style={styles.menu}
      currentRoute={currentRoute}
    />
  );
};

const PlayGameButton = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const computedStyles = StyleSheet.create({
    gameButton: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
  });
  return (
    <Pressable style={[computedStyles.gameButton, styles.gameButton]}>
      <View style={styles.itemsWrapper}>
        <GameIcon />
        <Text>{t('ride_Menu_playGameButton')}</Text>
      </View>
      <PlayIcon />
    </Pressable>
  );
};
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
});

export default Menu;
