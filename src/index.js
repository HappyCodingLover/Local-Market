import React, {Component} from 'react';
import {store, persistor} from './store';
import {StatusBar, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigation from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment-timezone';
import messaging from '@react-native-firebase/messaging';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
// import FontAwesome5FreeIcon from 'react-native-vector-icons/FontAwesome5Free-Solid';

moment.tz.setDefault('Europe/Moscow');
FeatherIcon.loadFont();
IoniconsIcon.loadFont();
// FontAwesome5FreeIcon.loadFont();

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    SplashScreen.hide();
    StatusBar.setBackgroundColor('#FFFFFF', true);
    await messaging().registerDeviceForRemoteMessages();
    await messaging().requestPermission();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}
