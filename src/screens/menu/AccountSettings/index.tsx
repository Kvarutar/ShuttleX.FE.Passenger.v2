import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
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

import { signOut } from '../../../core/auth/redux/thunks';
import { resetAccountSettingsVerification } from '../../../core/menu/redux/accountSettings';
import {
  accountSettingsChangeDataErrorSelector,
  accountSettingsVerifyStatusSelector,
  isAccountSettingsChangeDataLoadingSelector,
} from '../../../core/menu/redux/accountSettings/selectors';
import {
  changeAccountContactData,
  requestAccountSettingsChangeDataVerificationCode,
} from '../../../core/menu/redux/accountSettings/thunks';
import { profilePrefferedNameSelector, profileSelectedPhotoSelector } from '../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { PhotoBlockProps } from './types';

//TODO rewrite this block for new profile state
const AccountSettings = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();

  const prefferedName = useSelector(profilePrefferedNameSelector);
  const changeDataError = useSelector(accountSettingsChangeDataErrorSelector);
  const isChangeDataLoading = useSelector(isAccountSettingsChangeDataLoadingSelector);
  const verifiedStatus = useSelector(accountSettingsVerifyStatusSelector);

  useEffect(() => {
    dispatch(resetAccountSettingsVerification());
  }, [dispatch]);

  const handleOpenVerification = async (mode: 'phone' | 'email', newValue: string, method: 'change' | 'verify') => {
    if (!isChangeDataLoading && !changeDataError) {
      let oldData: string | undefined;

      switch (mode) {
        case 'phone':
          //TODO change it when back will synchronize profile
          oldData = verifiedStatus.phoneInfo;
          break;
        case 'email':
          oldData = verifiedStatus.emailInfo;
          break;
      }

      switch (method) {
        case 'change':
          try {
            await dispatch(
              changeAccountContactData({ mode, data: { oldData: oldData ?? '', newData: newValue } }),
            ).unwrap();
            // If there is an error, then try catch will catch it and the next line will not be executed
            navigation.navigate('AccountVerificateCode', { mode, newValue, method });
          } catch (_) {}
          break;

        case 'verify':
          await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: oldData ?? '' }));
          navigation.navigate('AccountVerificateCode', { mode, method });
          break;
      }
    }
  };

  const onUploadPhoto = () => {
    navigation.navigate('ProfilePhoto');
  };

  return (
    <>
      <SafeAreaView containerStyle={styles.wrapper}>
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)}>
          <Text style={styles.textTitle}>{t('ride_Menu_navigationAccountSettings')}</Text>
        </MenuHeader>
        <AccountSettingsScreen
          isChangeDataLoading={isChangeDataLoading}
          onSignOut={() => dispatch(signOut())}
          handleOpenVerification={handleOpenVerification}
          profile={{
            fullName: prefferedName ?? '',
            //TODO change it when back will synchronize profile
            email: verifiedStatus.emailInfo ?? '',
            phone: verifiedStatus.phoneInfo ?? '',
          }}
          verifiedStatus={verifiedStatus}
          photoBlock={<PhotoBlock onUploadPhoto={onUploadPhoto} />}
        />
      </SafeAreaView>
      {isMenuVisible && <Menu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
};

const PhotoBlock = ({ onUploadPhoto }: PhotoBlockProps) => {
  const selectedPhoto = useSelector(profileSelectedPhotoSelector);

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
        <MenuUserImage2 url={selectedPhoto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 24,
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
