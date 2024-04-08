import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { MMKV } from 'react-native-mmkv';
import Navigation from './src/Navigation/Navigation';
export const storage = new MMKV();

const App = () => {
  return (
      <Navigation />
  ) ;
};

export default App;

const styles = StyleSheet.create({});
