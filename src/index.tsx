import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import AppProvider from './hooks';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#312e38', flex: 1 }}>
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#312e38" />
      <Routes />
    </AppProvider>
  </View>
);

export default App;
