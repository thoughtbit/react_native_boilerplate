/**
 * @format
 */

import * as React from 'react';
import { Text } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { RootView } from './components/RootView';

class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <RootView
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Welcome to React Native!</Text>
      </RootView>
    );
  }
}

export default App;
