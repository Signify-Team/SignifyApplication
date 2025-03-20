import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './front-end-layer/navigation/MainNavigator';
import {NativeModules} from 'react-native';
import { linking } from './front-end-layer/utils/linking';

console.log("hi", NativeModules);
const App = () => (
    <NavigationContainer linking={linking}>
        <MainNavigator />
    </NavigationContainer>
);

export default App;
