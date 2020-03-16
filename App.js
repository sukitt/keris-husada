import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';

/* UI Kitten */
import { ApplicationProvider, IconRegistry, Layout } from '@ui-kitten/components';
import { mapping, light , dark } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

/* COMPONENT */
import AppNavigator from './navigation/AppNavigator';
// React context
import { ThemeContext } from './constants/theme-context';
// Redux store
import configureStore from './redux/store/configureStore';

const store = configureStore();
const themes = { light, dark };

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [theme, setTheme] = useState('light');

  const currentTheme = themes[theme];
  
  const toggleTheme = () => {
    const nextTheme = theme === 'light'? 'dark': 'light';
    setTheme(nextTheme);
  } 

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
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <ApplicationProvider mapping={mapping} theme={currentTheme}>
            <Root>
              <AppNavigator />
            </Root>
          </ApplicationProvider>
        </ThemeContext.Provider>
        <StatusBar barStyle='dark-content' />
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
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      antoutline: require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
      antfill: require('@ant-design/icons-react-native/fonts/antfill.ttf'),
      ...Ionicons.font,
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}


