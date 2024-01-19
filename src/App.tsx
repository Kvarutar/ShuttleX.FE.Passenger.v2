import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'shuttlex-integration';

import { store } from './core/redux/store';
import Navigate from './Navigate';

const App = (): JSX.Element => (
  <ThemeProvider>
    <Provider store={store}>
      <GestureHandlerRootView style={styles.gestureHandlerRootView}>
        <Navigate />
      </GestureHandlerRootView>
    </Provider>
  </ThemeProvider>
);

const styles = StyleSheet.create({
  gestureHandlerRootView: { flex: 1 },
});

export default App;
