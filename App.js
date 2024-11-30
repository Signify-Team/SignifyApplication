import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './front-end-layer/navigation/MainNavigator';

const App = () => (
  <NavigationContainer>
    <MainNavigator />
  </NavigationContainer>
);

export default App;
