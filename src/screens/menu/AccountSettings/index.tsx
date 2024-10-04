import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AccountSettingsScreen, MenuHeader, SafeAreaView, sizes, Text } from 'shuttlex-integration';

import { useAppDispatch } from '../../../core/redux/hooks';
import { setProfile } from '../../../core/redux/passenger';
import { profileSelector } from '../../../core/redux/passenger/selectors';
import { type Profile } from '../../../core/redux/passenger/types';
import Menu from '../../ride/Menu';
import { AccountSettingsScreenProps } from './props';

const windowSizes = Dimensions.get('window');
const isSmallPhone = windowSizes.height < 700;

const AccountSettings = ({ navigation }: AccountSettingsScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useSelector(profileSelector);

  const handleProfileDataSave = (profileData: Profile) => {
    dispatch(setProfile(profileData));
  };

  const computedStyles = StyleSheet.create({
    wrapper: {
      gap: isSmallPhone ? 0 : 24,
      paddingTop: isSmallPhone ? 0 : 8,
    },
  });
  return (
    <>
      <SafeAreaView containerStyle={[styles.wrapper, computedStyles.wrapper]}>
        <View style={styles.headerStyle}>
          <MenuHeader
            onMenuPress={() => setIsMenuVisible(true)}
            onNotificationPress={() => navigation.navigate('Notifications')}
          >
            <Text>{t('ride_Menu_navigationSettings')}</Text>
          </MenuHeader>
        </View>
        <AccountSettingsScreen
          onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: profile?.fullName ?? '',
            email: profile?.email ?? '',
            phone: profile?.phone ?? '',
            imageUri: profile?.imageUri ?? '',
          }}
        />
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
});
export default AccountSettings;
