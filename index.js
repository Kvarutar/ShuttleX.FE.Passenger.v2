/**
 * @format
 */

import './src/core/locales/i18n';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { AppRegistry } from 'react-native';
import { enableLatestRenderer } from 'react-native-maps';

import { name as appName } from './app.json';
import App from './src/App';
import { setupNotifications } from './src/core/utils/notifications/notificationSetup';

enableLatestRenderer();
setupNotifications();

AppRegistry.registerComponent(appName, () => App);
