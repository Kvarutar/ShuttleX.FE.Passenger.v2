import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ButtonV1,
  ButtonV1Shapes,
  NotificationsScreen as NotificationsScreenIntegration,
  SafeAreaView,
  ShortArrowIcon,
  Text,
} from 'shuttlex-integration';

import { notificationsListSelector } from '../../../core/menu/redux/notifications/selectors';
import { NotificationsScreenProps } from './props';

const NotificationsScreen = ({ navigation }: NotificationsScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const notifications = useSelector(notificationsListSelector);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <ButtonV1 shape={ButtonV1Shapes.Circle} onPress={navigation.goBack}>
          <ShortArrowIcon />
        </ButtonV1>
        <Text style={styles.headerTitle}>{t('menu_Notifications_headerTitle')}</Text>
        <View style={styles.headerDummy} />
      </View>
      <NotificationsScreenIntegration notifications={notifications} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
