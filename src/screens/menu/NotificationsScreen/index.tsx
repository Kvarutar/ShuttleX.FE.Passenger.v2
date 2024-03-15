import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Notifications, RoundButton, ShortArrowIcon, sizes, Text, useTheme } from 'shuttlex-integration';

import { notificationsListSelector } from '../../../core/menu/redux/notifications/selectors';
import { NotificationsScreenProps } from './props';

const NotificationsScreen = ({ navigation }: NotificationsScreenProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const notifications = useSelector(notificationsListSelector);

  const computedStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
    container: {
      paddingVertical: Platform.OS === 'android' ? sizes.paddingVertical : 0,
    },
  });

  return (
    <SafeAreaView style={[styles.wrapper, computedStyles.wrapper]}>
      <View style={[styles.container, computedStyles.container]}>
        <View style={[styles.header]}>
          <RoundButton onPress={navigation.goBack}>
            <ShortArrowIcon />
          </RoundButton>
          <Text style={[styles.headerTitle]}>{t('menu_Notifications_headerTitle')}</Text>
          <View style={styles.headerDummy} />
        </View>
        <Notifications notifications={notifications} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.paddingHorizontal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: 'Inter Medium',
    fontSize: 18,
  },
  headerDummy: {
    width: 50,
  },
});

export default NotificationsScreen;
