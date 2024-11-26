import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  AccountSettingsScreen,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  MenuHeader,
  MenuUserImage2,
  SafeAreaView,
  sizes,
  Text,
  UploadPhotoIcon,
} from 'shuttlex-integration';

import { resetAccountSettingsVerification } from '../../../core/menu/redux/accountSettings';
import {
  accountSettingsErrorSelector,
  isAccountSettingsLoadingSelector,
  isAccountSettingsVerificationDoneSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import { changeAccountContactData } from '../../../core/menu/redux/accountSettings/thunks';
import { useAppDispatch } from '../../../core/redux/hooks';
import { profilePhotoSelector, profileSelector } from '../../../core/redux/passenger/selectors';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { PhotoBlockProps } from './types';

const AccountSettings = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useSelector(profileSelector);
  const isVerificationDone = useSelector(isAccountSettingsVerificationDoneSelector);
  const changeDataError = useSelector(accountSettingsErrorSelector);
  const isLoading = useSelector(isAccountSettingsLoadingSelector);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAccountSettingsVerification());
    }, [dispatch]),
  );

  const handleOpenVerification = async (mode: 'phone' | 'email', newValue: string) => {
    if (!isLoading && !changeDataError) {
      try {
        await dispatch(
          changeAccountContactData({ method: mode, data: { oldData: profile?.[mode] ?? '', newData: newValue } }),
        ).unwrap();
        // If there is an error, then try catch will catch it and the next line will not be executed
        navigation.navigate('AccountVerificateCode', { mode, newValue });
      } catch (_) {}
    }
  };

  //TODO dont need this for now
  // const handleProfileDataSave = (profileData: AccountProfileDataProps) => {
  //   dispatch(updateProfile(profileData));
  // };

  const onUploadPhoto = () => {
    // navigation.navigate('ProfilePhoto');
    // TODO Change after reliese
  };

  return (
    <>
      <SafeAreaView containerStyle={styles.wrapper}>
        <MenuHeader
          onMenuPress={() => setIsMenuVisible(true)}
          onNotificationPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.textTitle}>{t('ride_Menu_navigationAccountSettings')}</Text>
        </MenuHeader>
        <AccountSettingsScreen
          handleOpenVerification={handleOpenVerification}
          isVerificationDone={isVerificationDone}
          // onProfileDataSave={handleProfileDataSave}
          profile={{
            fullName: profile?.fullName ?? '',
            email: profile?.email ?? '',
            phone: profile?.phone ?? '',
          }}
          photoBlock={<PhotoBlock onUploadPhoto={onUploadPhoto} />}
        />
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const PhotoBlock = ({ onUploadPhoto }: PhotoBlockProps) => {
  const profilePhoto = useSelector(profilePhotoSelector);

  const [imageHeight, setImageHeight] = useState(0);

  const computedStyles = StyleSheet.create({
    icon: {
      bottom: -(imageHeight - 64) / 2,
    },
  });

  const handleImageLayout = (event: LayoutChangeEvent) => {
    setImageHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.profilePhotoBox}>
      <Button
        onPress={onUploadPhoto}
        style={[computedStyles.icon, styles.icon]}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.M}
        shape={ButtonShapes.Circle}
      >
        <UploadPhotoIcon />
      </Button>
      <View onLayout={handleImageLayout}>
        <MenuUserImage2 url={profilePhoto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
    paddingTop: 8,
  },
  textTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  icon: {
    position: 'absolute',
    right: sizes.paddingHorizontal,
  },
  profilePhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
export default AccountSettings;
