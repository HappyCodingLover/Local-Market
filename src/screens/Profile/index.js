import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '@actions';
import { bindActionCreators } from 'redux';
import {
  View,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BaseStyle, BaseColor, BaseSize } from '@config';
import { SafeAreaView, Text, Icon, Header } from '@components';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import RBSheet from 'react-native-raw-bottom-sheet';
import { GuestServices } from '../../services';
import fbauth from '@react-native-firebase/auth';
import RuFlag from '../../assets/svgs/ru_flag.svg';
import Feather from 'react-native-vector-icons/Feather';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showAlert: false,
    };
  }

  editProfile = () => {
    this.props.navigation.navigate('ProfileEdit');
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

  logout = () => {
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

  onLogoutBtn = () => {
    const { navigation, auth, actions } = this.props;
    this.setState({ loading: true });
    GuestServices.logout(auth.user.access_token)
      .then((response) => {
        if (response.data.success === 1) {
          fbauth()
            .signOut()
            .then(() => {
              actions.saveUserData(null);
              actions.saveProfile(null);
              actions.saveAddresses([]);
              actions.clearPartner();
              actions.clearDiscountPrice();
              actions.clearTotalPrice();
              actions.clearCart();
              actions.clearDeliveryDay();
              actions.saveProducts([]);
              actions.setActiveAddress(undefined);
            })
            .catch((err) => {
              console.error('err in signOut', err);
              navigation.navigate('ErrorScreen', { message: err.message });
            })
            .finally(() => {
              navigation.navigate('Loading');
            });
        } else {
          console.error(
            'something went wrong while logging out',
            response.data.message,
          );
          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err in logout', err);
        navigation.navigate('ErrorScreen', {
          message: err.message,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  renderSettingPopup() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        height={160}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        openDuration={500}
        customStyles={{
          container: {
            backgroundColor: 'white',
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
          },
          draggableIcon: {
            backgroundColor: BaseColor.grayColor,
            width: 70,
          },
        }}>
        <View>
          <TouchableOpacity
            style={{ paddingVertical: 20 }}
            onPress={() => {
              this.RBSheet.close();
              this.editProfile();
            }}>
            <Text body1 bold greenColor style={{ textAlign: 'center' }}>
              {'Редактировать профиль'}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: 'black',
              opacity: 0.1,
              borderBottomWidth: 2,
              marginLeft: 5,
              marginRight: 5,
            }}
          />
          <TouchableOpacity
            style={{ paddingVertical: 20 }}
            onPress={() => {
              this.RBSheet.close();
              this.logout();
            }}>
            <Text body1 bold greenColor style={{ textAlign: 'center' }}>
              {'Выйти'}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 2,
              opacity: 0.1,
              marginLeft: 5,
              marginRight: 5,
            }}
          />
        </View>
      </RBSheet>
    );
  }

  render() {
    const { loading, showAlert } = this.state;
    const { t, navigation, auth } = this.props;
    return (
      <AndroidBackHandler
        onBackPress={() => {
          BackHandler.exitApp();
          return true;
        }}>
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          forceInset={{ top: 'never' }}>
          <Spinner visible={loading} color="#FF2D34" />
          <StatusBar
            hidden={false}
            barStyle="dark-content"
            backgroundColor="white"
          />
          <View style={styles.contain}>
            <Header
              title={'Мой Профиль'}
              renderLeft={() => {
                return (
                  <Feather
                    name="menu"
                    size={BaseSize.headerMenuIconSize}
                    color={BaseColor.redColor}
                  />
                );
              }}
              onPressLeft={() => {
                navigation.openDrawer();
              }}
              renderRight={() => {
                return (
                  <Icon
                    name="ellipsis-v"
                    size={BaseSize.headerIconSize}
                    color={BaseColor.redColor}
                  />
                );
              }}
              onPressRight={() => {
                this.RBSheet.open();
              }}
            />
            <View style={styles.mainContainer}>
              <Text body2>{'Имя'}</Text>
              <Text style={styles.textInput}>{auth.profile?.name}</Text>
              <Text body2>{'Электронная почта'}</Text>
              <Text style={styles.textInput}>{auth.profile?.email}</Text>
              <Text body2>{'Номер телефона'}</Text>
              <TouchableOpacity
                onPress={this.onChangePhoneNumber}
                style={{
                  backgroundColor: BaseColor.fieldColor,
                  paddingLeft: 10,
                  height: 44,
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginTop: 7,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RuFlag width={20} height={14} />
                    <View style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 14 }}>
                        {this.formatPhoneNumber(auth.profile?.phone)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        {this.renderSettingPopup()}
      </AndroidBackHandler>
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
)(Profile);
