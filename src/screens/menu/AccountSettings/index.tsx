import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  AccountSettingsRef,
  AccountSettingsScreen,
  AccountSettingsVerificationMethod,
  Button,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  ConfirmDeleteAccountPopup,
  DeleteAccountPopup,
  isIncorrectFieldsError,
  MenuHeader,
  MenuUserImage2,
  SafeAreaView,
  SignOutPopup,
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'AccountSettings'>>();
  const accountSettingsRef = useRef<AccountSettingsRef>(null);

  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const dispatch = useAppDispatch();

  const prefferedName = useSelector(profilePrefferedNameSelector);
  const changeDataError = useSelector(accountSettingsChangeDataErrorSelector);
  const isChangeDataLoading = useSelector(isAccountSettingsChangeDataLoadingSelector);
  const verifiedStatus = useSelector(accountSettingsVerifyStatusSelector);
  const [isSignOutPopupVisible, setIsSignOutPopupVisible] = useState(false);
  const [errorField, setErrorField] = useState<string>('');
  const [isDeleteAccountPopupVisible, setIsDeleteAccountPopupVisible] = useState(false);
  const [isConfirmDeleteAccountPopupVisible, setIsConfirmDeleteAccountPopupVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAccountSettingsVerification());
    }, [dispatch]),
  );

  useEffect(() => {
    if (changeDataError && isIncorrectFieldsError(changeDataError)) {
      if (Array.isArray(changeDataError.body)) {
        changeDataError.body.forEach(item => {
          accountSettingsRef.current?.showErrors({ [item.field]: item.message });
        });
      } else if (changeDataError.body.message) {
        accountSettingsRef.current?.showErrors({
          [errorField === 'phone' ? 'newphone' : 'newemail']: changeDataError.body.message,
        });
      }
    }
  }, [changeDataError, errorField]);

  const handleOpenVerification = async (
    mode: 'phone' | 'email',
    newValue: string,
    method: AccountSettingsVerificationMethod,
  ): Promise<boolean | void> => {
    setErrorField(mode);
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
          navigation.navigate('AccountVerificateCode', { mode, newValue, method });
          return true;
        } catch (error) {
          return false;
        }

      case 'verify':
        try {
          await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: oldData }));
          navigation.navigate('AccountVerificateCode', { mode, method });
          return true;
        } catch (error) {
          return false;
        }
      case 'delete':
        await dispatch(requestAccountSettingsChangeDataVerificationCode({ mode, data: oldData ?? '' }));
        navigation.navigate('AccountVerificateCode', { mode, method });
        break;
    }
  };

  const onUploadPhoto = () => {
    navigation.navigate('ProfilePhoto');
  };

  return (
    <>
      <SafeAreaView containerStyle={styles.wrapper}>
        <MenuHeader onMenuPress={() => setIsMenuVisible(true)} style={styles.menuHeader}>
          <Text style={styles.textTitle}>{t('ride_Menu_navigationAccountSettings')}</Text>
        </MenuHeader>
        <AccountSettingsScreen
          ref={accountSettingsRef}
          setIsSignOutPopupVisible={setIsSignOutPopupVisible}
          setIsDeleteAccountPopupVisible={setIsDeleteAccountPopupVisible}
          isChangeDataLoading={isChangeDataLoading}
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
      {isSignOutPopupVisible && (
        <SignOutPopup setIsSignOutPopupVisible={setIsSignOutPopupVisible} onSignOut={() => dispatch(signOut())} />
      )}
      {isDeleteAccountPopupVisible && (
        <DeleteAccountPopup
          setIsDeleteAccountPopupVisible={setIsDeleteAccountPopupVisible}
          onPressYes={() => setIsConfirmDeleteAccountPopupVisible(true)}
        />
      )}
      {isConfirmDeleteAccountPopupVisible && (
        <ConfirmDeleteAccountPopup
          handleOpenVerification={handleOpenVerification}
          setIsConfirmDeleteAccountPopupVisible={setIsConfirmDeleteAccountPopupVisible}
          userData={{ phone: verifiedStatus.phoneInfo, email: verifiedStatus.emailInfo }}
        />
      )}
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
  menuHeader: {
    zIndex: -1,
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
