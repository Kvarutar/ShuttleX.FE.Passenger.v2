import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { ThemeProviderV1 } from 'shuttlex-integration';

import { store } from './core/redux/store';
import Navigate from './Navigate';

if (__DEV__) {
  require('../ReactotronConfig');
}

const App = (): JSX.Element => (
  <ThemeProviderV1>
    <Provider store={store}>
      <GestureHandlerRootView style={styles.gestureHandlerRootView}>
        <Navigate />
      </GestureHandlerRootView>
    </Provider>
  </ThemeProviderV1>
);

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

export default App;
