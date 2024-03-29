import './shim.js'
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState, Keyboard, NetInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

import MainStore from './appstores/MainStore'
import { Provider } from 'mobx-react/native';

const appCoinsStore = MainStore.appState.appCoinsStore

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider appCoinsStore={appCoinsStore}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'Roboto': require("native-base/Fonts/Roboto.ttf"),
      'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
      'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'LatoRegular': require('./assets/fonts/Lato-Regular.ttf')
    }),
  ]);
  
  await MainStore.startApp();
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

async function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);

  AppState.addEventListener('change', this._handleAppStateChange);
}

handleFirstConnectivityChange = (connection) => {
  const connectionType = connection.type === 'none' ? 'offline' : 'online'
  if (connection.type === 'none') {
    console.log('No internet connection')
  }
  MainStore.appState.setInternetConnection(connectionType)
}

appState = 'active'

_handleAppStateChange = (nextAppState) => {
  if (this.appState === 'active' && nextAppState === 'inactive') {
    
  }
  if (nextAppState === 'inactive' || nextAppState === 'background') {
    Keyboard.dismiss()
  }
  
  if (this.appState === 'background' && nextAppState === 'active') {
    
  }
  this.appState = nextAppState
}

const styles = StyleSheet.create({
  container: {
    flex: 1, fontFamily:'OpenSans',
    backgroundColor: '#fff',
  },
  
});
