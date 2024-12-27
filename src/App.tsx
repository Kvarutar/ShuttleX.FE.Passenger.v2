import * as Sentry from '@sentry/react-native';
import { StyleSheet } from 'react-native';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import {
  createLogger,
  getDefaultDevSentryConfig,
  getDefaultProdSentryConfig,
  ThemeProvider,
  ThemeProviderV1,
} from 'shuttlex-integration';

import { store } from './core/redux/store';
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
    <ThemeProviderV1>
      <ThemeProvider>
        <Provider store={store}>
          <GestureHandlerRootView style={styles.gestureHandlerRootView}>
            <InitialSetup>
              <Navigate />
            </InitialSetup>
          </GestureHandlerRootView>
        </Provider>
      </ThemeProvider>
    </ThemeProviderV1>
  </Sentry.ErrorBoundary>
);

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

export default Sentry.wrap(App);
