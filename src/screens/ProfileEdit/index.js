import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {bindActionCreators} from 'redux';
import {View, TouchableOpacity, Alert} from 'react-native';
import {BaseColor, BaseSize} from '@config';
import {SafeAreaView, Text, Header, TextInput} from '@components';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {isValidNumberForRegion} from 'libphonenumber-js';
import {GuestServices, UserServices} from '../../services';
import fbauth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RuFlag from '../../assets/svgs/ru_flag.svg';
import {useFocusEffect} from '@react-navigation/native';
import Intercom from 'react-native-intercom';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      originalName: '',
      email: '',
      originalEmail: '',
      loading: false,
      showAlert: false,
      countryCode: 'RU',
      callingCode: '7',
      phoneNumber: '',
      formattedPhoneNumber: '',
      originalPhoneNumber: '',
      cpModalVisible: false,
      editable: false,
      emailError: false,
      isNameClicked: false,
      isEmailClicked: false,
    };
  }

  onFocus = () => {
    const {auth, navigation, route, actions} = this.props;
    this.setState({loading: true});
    UserServices.getProfile(auth.user.access_token)
      .then((response) => {
        if (response.data.success === 1) {
          actions.saveProfile({
            name: response.data.data.name,
            email: response.data.data.email,
            phone: response.data.data.phone,
          });
          this.setState({
            name: response.data.data.name,
            originalName: response.data.data.name,
            surname: response.data.data.surname,
            email: response.data.data.email,
            originalEmail: response.data.data.email,
          });
          setTimeout(() => {
            this.setState({editable: true});
          }, 1500);

          if (route.params !== undefined && route.params.from !== undefined) {
            this.setState({
              formattedPhoneNumber: this.formatPhoneNumber(
                '+7' + route.params.phoneNumber,
              ),
              phoneNumber: '+7' + route.params.phoneNumber,
            });
          } else {
            if (auth.user) {
              const {profile, user} = auth;
              if (profile !== null) {
                this.setState({
                  name: profile.name,
                  originalName: profile.name,
                  email: profile.email,
                  originalEmail: profile.email,
                  callingCode: profile.callingCode,
                  phoneNumber: profile.phone,
                  formattedPhoneNumber: this.formatPhoneNumber(profile.phone),
                  originalPhoneNumber: profile.phone,
                });
              } else {
                this.setState({
                  phoneNumber: user.phoneNumber,
                  originalPhoneNumber: user.phoneNumber,
                  formattedPhoneNumber: this.formatPhoneNumber(
                    user.phoneNumber,
                  ),
                });
              }
            } else {
              Alert.alert(
                'Хотите отредактировать профиль?',
                'Сначала войдите в систему',
                [
                  {
                    text: 'Нет',
                    onPress: () => {
                      navigation.goBack();
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'Да',
                    onPress: () => {
                      navigation.navigate('SignIn', {from: 'ProfileEdit'});
                    },
                  },
                ],
              );
            }
          }
        } else {
          console.error(
            'something went wrong while getting profile',
            response.data.message,
          );
          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err while getting profile', err);
        navigation.navigate('ErrorScreen', {
          message: err.message,
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(7|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      var intlCode = match[1] ? '+7 ' : '';
      return [
        intlCode,
        '(',
        match[2],
        ') ',
        match[3],
        ' ',
        match[4],
        ' ',
        match[5],
      ].join('');
    }
    return null;
  }

  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(text);
  };

  onSaveBtn = () => {
    const {name, email, phoneNumber, callingCode} = this.state;
    const {navigation, actions, auth} = this.props;
    this.setState({emailError: !this.validate(email)});
    if (!this.validate(email)) {
      return;
    }
    const phone = phoneNumber;

    const body = {
      name: name,
      email: email,
      phone: phone,
    };
    this.setState({loading: true});
    UserServices.saveProfile(body, auth.user.access_token)
      .then((response) => {
        if (response.data.success === 1) {
          actions.saveProfile({
            name: name,
            email: email,
            phone: phoneNumber,
            callingCode: callingCode,
          });
        } else {
          console.error('something went wrong', response.data.message);
          this.setState({loading: false});

          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err in saveProfile', err);
        this.setState({loading: false});

        navigation.navigate('ErrorScreen', {message: err.message});
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  checkInput = () => {
    const {
      name,
      email,
      phoneNumber,
      countryCode,
      originalEmail,
      originalName,
    } = this.state;
    const {auth} = this.props;

    if (name === '' || email === '') return false;
    if (auth.profile !== null) {
      if (name === auth.profile.name && email === auth.profile.email)
        return false;
    }
    if (!isValidNumberForRegion(phoneNumber, countryCode)) {
      return false;
    }
    if (originalEmail === email && originalName === name) {
      return false;
    }
    return true;
  };

  onLogoutBtn = async () => {
    const {navigation, auth, actions} = this.props;
    this.setState({loading: true});
    try {
      const response = await GuestServices.logout(auth.user.access_token);
      if (response.data.success === 1) {
        try {
          await actions.saveUserData(null);
          await actions.saveAddresses([]);
          await actions.clearTotalPrice();
          await actions.setActiveAddress(null);
          await fbauth().signOut();
          Intercom.logout();
          navigation.navigate('SignIn');
        } catch (error) {
          console.error('err in fbauth signOut', error);
          navigation.navigate('ErrorScreen', {message: error.message});
        }
      } else {
        console.error('response fail in api signOut', response.data.message);
        navigation.navigate('ErrorScreen', {
          message: response.data.message.message,
        });
      }
    } catch (error) {
      console.error('err in signOut', error);
      navigation.navigate('ErrorScreen', {message: error.message});
    }
    this.setState({loading: false});
  };

  logoutAlert = () => {
    Alert.alert(
      'Вы уверены, что хотите выйти?',
      'При выходе из профиля мы сохраним ваши данные',
      [
        {
          text: 'Нет',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Да',
          onPress: () => {
            this.onLogoutBtn();
          },
        },
      ],
    );
  };

  onChangePhoneNumber = () => {
    const {phoneNumber} = this.state;
    const {navigation} = this.props;
    navigation.navigate('ChangePhone', {
      phoneNumber: phoneNumber,
      from: 'ProfileEdit',
    });
  };

  render() {
    const {
      name,
      email,
      editable,
      loading,
      emailError,
      formattedPhoneNumber,
      isNameClicked,
    } = this.state;

    const {navigation, auth} = this.props;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <SafeAreaView
          style={{flex: 1, backgroundColor: 'white'}}
          forceInset={{top: 'never'}}>
          <Spinner visible={loading} color="#FF2D34" />
          <Header
            title="Мой Профиль"
            whiteHeaderColor
            renderLeft={() => {
              return (
                <FeatherIcon
                  name="menu"
                  size={BaseSize.headerMenuIconSize}
                  color={BaseColor.redColor}
                />
              );
            }}
            onPressLeft={() => {
              if (this.checkInput()) {
                Alert.alert('Вы уверены?', 'Все изменения будут утрачены.', [
                  {
                    text: 'Нет',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'Да',
                    onPress: () => {
                      navigation.openDrawer();
                    },
                  },
                ]);
              } else {
                navigation.openDrawer();
              }
            }}
            renderRight={() => {
              return (
                <Text middleBody redColor>
                  {'Выйти'}
                </Text>
              );
            }}
            onPressRight={() => {
              this.logoutAlert();
            }}
          />
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              justifyContent: 'space-between',
            }}>
            {/* name, email, phone number inputs */}
            <View>
              <View style={{marginTop: 20}}>
                <View style={{marginBottom: 7}}>
                  <Text lightGrayColor>{'Введите ваше имя'}</Text>
                </View>
                <View style={styles.textInput1}>
                  <TextInput
                    editable={auth.profile?.name === undefined || isNameClicked}
                    value={name}
                    placeholder="Иван Иванов"
                    style={{fontSize: 16}}
                    onChangeText={(text) => {
                      this.setState({name: text});
                    }}
                  />
                </View>
              </View>
              <View style={{marginTop: 20}}>
                <View style={{marginBottom: 7}}>
                  <Text lightGrayColor>{'Введите ваш E-Mail'}</Text>
                </View>
                <View style={styles.textInput1}>
                  {/* <TextInput
                    caretHidden
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    value={email}
                    placeholder="mail@mail.ru"
                    editable={
                      // auth.profile?.email === undefined || isEmailClicked
                      editable
                    }
                    style={{ fontSize: 16 }}
                    onChangeText={(text) => {
                      this.setState({ email: text });
                    }}
                  /> */}
                  <TextInput
                    placeholder="mail@gmail.com"
                    autoCapitalize="none"
                    onChangeText={(text) => this.setState({email: text})}
                    value={email}
                    style={{fontSize: 16}}
                  />
                </View>
                {emailError && (
                  <Text body2 style={{color: '#5858589E', marginTop: 5}}>
                    {'Email введен неверно, повторите попытку'}
                  </Text>
                )}
              </View>
              <View style={{marginTop: 20}}>
                <View style={{marginBottom: 7}}>
                  <Text lightGrayColor>{'Введите номер вашего телефона'}</Text>
                </View>
                <TouchableOpacity
                  onPress={this.onChangePhoneNumber}
                  style={{
                    backgroundColor: BaseColor.fieldColor,
                    paddingLeft: 10,
                    height: 44,
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RuFlag width={20} height={14} />
                      <View style={{marginLeft: 5}}>
                        <Text middleBody>{formattedPhoneNumber}</Text>
                      </View>
                    </View>
                    <FeatherIcon
                      name="chevron-right"
                      size={20}
                      color="#D1D1D1"
                      style={{marginRight: 10}}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* save button */}
            <TouchableOpacity
              onPress={this.onSaveBtn}
              disabled={!this.checkInput()}
              style={{
                backgroundColor: this.checkInput()
                  ? BaseColor.redColor
                  : BaseColor.textInputBackgroundColor,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 50,
                height: 44,
              }}>
              <Text
                body1
                style={
                  this.checkInput()
                    ? {color: BaseColor.whiteColor}
                    : {color: BaseColor.placeholderColor}
                }>
                {'Сохранить'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {auth: state.auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileEdit);
