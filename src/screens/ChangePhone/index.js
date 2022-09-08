import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '@actions';
import { bindActionCreators } from 'redux';
import {
  View,
  StatusBar,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BaseStyle, BaseColor, BaseSize } from '@config';
import { SafeAreaView, Text } from '@components';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import fbauth from '@react-native-firebase/auth';
import styles from './styles';
import { isValidNumberForRegion } from 'libphonenumber-js';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Background from '../../assets/svgs/background.svg';
import { useFocusEffect } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TextInputMask } from 'react-native-masked-text';
import RuFlag from '../../assets/svgs/ru_flag.svg';
import { GuestServices } from '../../services';

function FocusEfect({ onFocus }) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

const phonePlaceholder = '(999) 888 77 66';

class ChangePhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      loading: false,
      loading1: false,
      countryCode: 'RU',
      callingCode: '7',
      cpModalVisible: false,
      showSkipBtn: false,
      showBackBtn: false,
      errorMsg: null,
      fakeNumber: '',
      valuE: '',
      isBack: false,
      verificationID: null,
      verificationCode: null,
    };
  }
  onFocus = () => {
    this.setState({ loading: false });
    const { params } = this.props.route;
    if (params !== undefined) {
      if (
        params.from === 'ProfileEdit' ||
        params.from === 'Payment' ||
        params.from === 'Orders' ||
        params.from === 'Catalogue'
      ) {
        this.setState({ showSkipBtn: true, showBackBtn: true });
      }
    } else {
    }
  };

  checkInput() {
    const { phoneNumber, countryCode } = this.state;
    if (phoneNumber === '') {
      return false;
    }
    if (!isValidNumberForRegion(phoneNumber, countryCode)) {
      return false;
    }
    return true;
  }

  updatePhoneNumber = async (phone) => {
    const { navigation } = this.props;
    try {
      const snapshot = await fbauth().verifyPhoneNumber(phone);
      this.setState({
        verificationID: snapshot.verificationId,
      });
      this.setState({ loading: false }, () => {
        navigation.navigate('ChangePhoneVerify', {
          verificationId: snapshot.verificationId,
          phoneNumber: this.state.phoneNumber,
        });
      });
    } catch (error) {
      console.error('err in verifyPhoneNumber', error);
      navigation.navigate('ErrorScreen', { message: error.message });
    }
  };

  onNextBtn = async () => {
    if (!this.checkInput()) {
      return;
    }

    const { auth, actions, navigation } = this.props;
    const { callingCode, phoneNumber } = this.state;

    const phone = `+${callingCode}${phoneNumber}`;
    actions.savePhone(phoneNumber);
    const unmasked = this.inputMaskPhone.getRawValue();
    if (auth.user.phoneNumber === `+${callingCode}${unmasked}`) {
      this.setState({ errorMsg: 'Это ваш текущий номер телефона' });
      return;
    }
    this.setState({ loading: true });
    GuestServices.checkIfPhoneNumberExists(`+${callingCode}${unmasked}`)
      .then((response) => {
        if (response.data.success === 1) {
          var result = response.data.exist;
          if (result === 1) {
            this.setState({
              errorMsg: 'Этот номер уже используется. Попробуйте другой номер.',
            });
            return;
          } else {
            // Update Phone Number
            this.setState({ phoneNumber: unmasked });
            this.updatePhoneNumber(phone);
          }
        } else {
          console.error(
            'something went wrong in checkIfPhoneNumberExists',
            response.data.message,
          );
        }
      })
      .catch((err) => {
        console.error('err in checkIfPhoneNumberExists', err);
      })
      .finally(() => {
        // this.setState({ loading: false });
      });
  };

  verify = () => {
    const { verificationCode, verificationID } = this.state;
    const credential = fbauth.PhoneAuthProvider.credential(
      verificationID,
      verificationCode,
    );

    this.setState({ loading: true });
    fbauth()
      .currentUser.updatePhoneNumber(credential)
      .then(() => {
      })
      .catch((err) => {
        console.error('err in updatePhoneNumber', err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  onSkipBtn = () => {
    const { auth, actions, navigation } = this.props;
    if (auth.addresses.length === 0) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Main', {
        screen: 'DrawerStack',
        params: { screen: 'Catalogue' },
      });
    }
  };

  renderSpinner = (loading) => {
    return <Spinner visible={loading} color="#FF2D34" />;
  };

  render() {
    const {
      loading,
      loading1,
      callingCode,
      showSkipBtn,
      showBackBtn,
      errorMsg,
    } = this.state;
    const { navigation, route } = this.props;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <AndroidBackHandler
          onBackPress={() => {
            BackHandler.exitApp();
            return true;
          }}>
          <SafeAreaView
            style={BaseStyle.safeAreaView}>
            {this.renderSpinner(loading)}
            <StatusBar
              hidden={false}
              barStyle="dark-content"
              backgroundColor="white"
            />
            <View style={styles.contain}>
              <Background style={styles.background} />
              <View style={styles.header}>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  {showBackBtn && (
                    <TouchableOpacity
                      onPress={() => {
                        if (route.params.from === 'ProfileEdit') {
                          navigation.navigate('Main');
                        } else if (route.params.from === 'Payment') {
                          navigation.navigate('Main', {
                            screen: 'DrawerStack',
                            params: { screen: 'Cart' },
                          });
                        } else if (route.params.from === 'Orders') {
                          navigation.navigate('Main', {
                            screen: 'DrawerStack',
                            params: { screen: 'Orders' },
                          });
                        } else if (route.params.from === 'Catalogue') {
                          navigation.navigate('Main', {
                            screen: 'DrawerStack',
                            params: { screen: 'ViewCatalogue' },
                          });
                        } else {
                          navigation.navigate('Main', {
                            screen: 'DrawerStack',
                            params: { screen: 'Catalogue' },
                          });
                        }
                      }}>
                      <FeatherIcon
                        name="chevron-left"
                        size={BaseSize.headerIconSize}
                        color={BaseColor.redColor}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.headerCenter}>
                  <Text headline style={{ textAlign: 'center' }}>
                    {'Укажите новый телефон'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}></View>
              </View>
              <View style={styles.topContainer}>
                <View style={styles.logoView}></View>
              </View>
              <KeyboardAwareScrollView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.centerContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Text lightGrayColor style={styles.typePhoneNumberText}>
                    {'Введите номер вашего телефона'}
                  </Text>
                  <View style={styles.phoneWrapper}>
                    <RuFlag width={20} height={14} />
                    <Text
                      middleBody
                      style={styles.callingCode}>{`+${callingCode}`}</Text>
                    <TextInputMask
                      style={{ width: 130, fontSize: 16 }}
                      // {...props}
                      ref={(ref) => {
                        this.inputMaskPhone = ref;
                      }}
                      autoFocus
                      type={'cel-phone'}
                      options={{
                        withDDD: true,
                        dddMask: '(999) 999 99 99',
                      }}
                      value={this.state.phoneNumber}
                      onChangeText={(text) => {
                        this.setState({ phoneNumber: text });
                      }}
                      placeholder={phonePlaceholder}
                    />
                  </View>
                  {errorMsg !== null && (
                    <Text body2 style={{ marginTop: 20, color: '#5858589E' }}>
                      {errorMsg}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={this.onNextBtn}
                    disabled={!this.checkInput()}
                    style={[
                      styles.nextBtn,
                      {
                        backgroundColor: this.checkInput()
                          ? '#FF2D34'
                          : '#F1F1F1',
                      },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        middleBody
                        style={{
                          color: this.checkInput() ? 'white' : '#B3B3B3',
                        }}>
                        {'Далее'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {loading1 && <ActivityIndicator />}
                  {showSkipBtn || (
                    <TouchableOpacity
                      onPress={this.onSkipBtn}
                      style={{ marginTop: 20 }}>
                      <View
                        style={{
                          width: 100,
                          height: 30,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text redColor>{'Пропустить'}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </KeyboardAwareScrollView>

              <View style={styles.bottomContainer}>
                <Text style={styles.termsText}>
                  {
                    'Нажимая Далее, я даю согласие на обработку моих персональных данных на условияхп политики конфиденциальности'
                  }
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </AndroidBackHandler>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePhone);
