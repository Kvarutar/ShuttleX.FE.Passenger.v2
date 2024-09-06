import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { ThemeProvider, ThemeProviderV1 } from 'shuttlex-integration';

import { store } from './core/redux/store';
import Navigate from './Navigate';

if (__DEV__) {
  require('../ReactotronConfig');
}

const App = (): JSX.Element => (
  /* {TODO: Remove one of ThemeProviders when we won't need it} */
  <ThemeProviderV1>
    <ThemeProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={styles.gestureHandlerRootView}>
          <Navigate />
        </GestureHandlerRootView>
      </Provider>
    </ThemeProvider>
  </ThemeProviderV1>
);

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

export default App;
