/**
 * @format
 */

import * as React from 'react';
import { View, Text } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f2f4f5',
        }}
      >
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
}

export default App;
