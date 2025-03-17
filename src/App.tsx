import * as Sentry from '@sentry/react-native';
import { StyleSheet } from 'react-native';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  createLogger,
  getDefaultDevSentryConfig,
  getDefaultProdSentryConfig,
  ThemeProvider,
} from 'shuttlex-integration';

import { MapProvider } from './core/map/mapContext';
import { persistor, store } from './core/redux/store';
import InitialSetup from './InitialSetup';
import Navigate from './Navigate';

let sentryConfig: Sentry.ReactNativeOptions = {};

if (__DEV__) {
  require('../ReactotronConfig');
  sentryConfig = getDefaultDevSentryConfig(Config.SENTRY_DSN ?? '');
} else {
  sentryConfig = getDefaultProdSentryConfig(Config.SENTRY_DSN ?? '');
}

export const logger = createLogger({ sentryConfig });

const App = (): JSX.Element => (
  /* {TODO: Remove one of ThemeProviders when we won't need it} */
  <Sentry.ErrorBoundary>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <MapProvider>
            <GestureHandlerRootView style={styles.gestureHandlerRootView}>
              <InitialSetup>
                <Navigate />
              </InitialSetup>
            </GestureHandlerRootView>
          </MapProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </Sentry.ErrorBoundary>
);

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

export default Sentry.wrap(App);
