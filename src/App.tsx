import React from 'react';
import { ThemeProvider } from 'shuttlex-integration';

import Navigate from './navigation/Navigate';

const App = (): JSX.Element => (
  <ThemeProvider>
    <Navigate />
  </ThemeProvider>
);

export default App;
