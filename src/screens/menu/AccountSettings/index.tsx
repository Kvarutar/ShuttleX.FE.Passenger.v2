import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
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

import { resetVerification } from '../../../core/menu/redux/accountSettings';
import { isVerificationDoneSelector } from '../../../core/menu/redux/accountSettings/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { updateProfile } from '../../../core/redux/passenger';
import { profileSelector } from '../../../core/redux/passenger/selectors';
import { RootStackParamList } from '../../../Navigate/props';
import Menu from '../../ride/Menu';
import { AccountProfileDataProps, PhotoBlockProps } from './props';

const windowSizes = Dimensions.get('window');
const isPhoneSmall = windowSizes.height < 700;

const AccountSettings = (): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useSelector(profileSelector);
  const isVerificationDone = useSelector(isVerificationDoneSelector);

  const computedStyles = StyleSheet.create({
    wrapper: {
      gap: isPhoneSmall ? 0 : 24,
      paddingTop: isPhoneSmall ? 0 : 8,
    },
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(resetVerification());
    }, [dispatch]),
  );

  useEffect(() => {
    if (isVerificationDone) {
      setIsVerificationOpen(false);
    }
  }, [isVerificationDone]);

  useEffect(() => {
    dispatch(updateProfile({ imageUri: profile?.imageUri }));
    //TODO Change when we'll know more about uploading photo

    if (isVerificationOpen) {
      navigation.navigate('AccountVerificateCode');
    }
  }, [isVerificationOpen, dispatch, navigation, profile?.imageUri]);

  const handleProfileDataSave = (profileData: AccountProfileDataProps) => {
    dispatch(updateProfile(profileData));
  };

  const onUploadPhoto = () => {
    // navigation.navigate('ProfilePhoto');
    // TODO Change after reliese
  };

  return (
    <>
      <SafeAreaView containerStyle={[styles.wrapper, computedStyles.wrapper]}>
        <View style={styles.headerStyle}>
          <MenuHeader
            onMenuPress={() => setIsMenuVisible(true)}
            onNotificationPress={() => navigation.navigate('Notifications')}
          >
            <Text>{t('ride_Menu_navigationAccountSettings')}</Text>
          </MenuHeader>
        </View>

        <AccountSettingsScreen
          setIsVerificationVisible={setIsVerificationOpen}
          isVerificationDone={isVerificationDone}
          onProfileDataSave={handleProfileDataSave}
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
  const profile = useSelector(profileSelector);

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
        <MenuUserImage2 url={profile?.imageUri} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: sizes.paddingHorizontal,
  },
  icon: {
    position: 'absolute',
    right: 16,
  },
  profilePhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
export default AccountSettings;
