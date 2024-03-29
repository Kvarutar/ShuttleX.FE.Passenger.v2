/**
 * @format
 */

import './src/core/locales/i18n';
import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import { enableLatestRenderer } from 'react-native-maps';

import { name as appName } from './app.json';
import App from './src/App';

enableLatestRenderer();

AppRegistry.registerComponent(appName, () => App);
