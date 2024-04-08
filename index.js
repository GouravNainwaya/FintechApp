/**
 * @format
 */

import * as React from 'react';
import {AppRegistry, Platform, SafeAreaView as SafeAreaIOS} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import App from './App';
import store from './src/redux/myStore';

export default function Main() {
  const SafeArea = Platform.OS === 'ios' ? SafeAreaIOS : SafeAreaView;
  return (
    <SafeArea style={{flex: 1}}>
      <Provider store={store}>
        <App />
      </Provider>
    </SafeArea>
  );
}

AppRegistry.registerComponent(appName, () => Main);
