import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {bindActionCreators} from 'redux';
import messaging from '@react-native-firebase/messaging';
import styles from './styles';
import fbauth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import {UserServices, NotificationServices} from '../../services';
import {Header} from '@components';
import Splash from '../../assets/svgs/splash.svg';

import {AppState, View, Dimensions, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LocalStorageService from '../../services/localStorageService';
import {acc} from 'react-native-reanimated';
const localStorageService = LocalStorageService.getService();

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appState: AppState.currentState,
      cart: null,
    };
  }

  _handleAppStateChange = (nextAppState) => {
    // if (nextAppState === 'inactive' || nextAppState === 'background') {
    if (nextAppState === 'background') {
      // auth.totalPrice > 0
      const {auth} = this.props;
      if (auth.totalPrice > 0) {
        NotificationServices.showScheduledNotification(
          'Завершите покупку',
          'Самые свежие товары уже в вашей корзине',
          30 * 60,
        );
        // After 6 hours
        NotificationServices.showScheduledNotification(
          'Вы проголодались?',
          'Мы уже подготовили самые лучшие продукты',
          6 * 60 * 60,
        );
        // After 12 hours
        NotificationServices.showScheduledNotification(
          'Ммм...Как вкусно',
          'Наша продукция не оставит вас равнодушными',
          12 * 60 * 60,
        );
      }
    }

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      NotificationServices.cancelAll();
    }
    this.setState({appState: nextAppState});
  };

  onFocus = () => {
    const {navigation, auth, actions} = this.props;
    AppState.addEventListener('change', this._handleAppStateChange);
    actions.setLoadingFalse();
    this.unsubscribeAuthState = fbauth().onAuthStateChanged((user) => {
      if (user) {
        // this user is using app with this device for the 1st time
        // let's see if this user's uid is in users table
        actions.setLoadingTrue();
        database()
          .ref('users/' + user.uid)
          .once('value', (snapshot) => {
            const profileData = snapshot.val();
            // get user's device token
            messaging()
              .getToken()
              .then((token) => {
                if (profileData) {
                  // already registered user, so only need to update the new device token.
                  database()
                    .ref('users/' + user.uid)
                    .update({
                      token: token,
                    })
                    .then(() => {
                      // save user data in device local
                      actions.saveUserData({
                        phoneNumber: user.phoneNumber,
                        token: token,
                      });
                      // login with phone number
                      this.handleLogin(user.phoneNumber, token);
                    })
                    .catch((error) => {
                      actions.setLoadingFalse();
                      console.error('err in database', error);
                      navigation.navigate('ErrorScreen', {
                        from: 'Loading',
                        message: error.message,
                      });
                    })
                    .finally(() => {
                      // actions.setLoadingFalse();
                    });
                } else {
                  // new user added, let's register him on DB and then, add the device token, too.
                  database()
                    .ref('users/' + user.uid)
                    .set({
                      phoneNumber: user.phoneNumber,
                      token: token,
                    })
                    .then(() => {
                      // save user data in device local
                      actions.saveUserData({
                        phoneNumber: user.phoneNumber,
                        token: token,
                      });
                      this.handleLogin(user.phoneNumber, token);
                    })
                    .catch((error) => {
                      actions.setLoadingFalse();
                      console.error('err in database 2', error);
                      navigation.navigate('ErrorScreen', {
                        from: 'Loading',
                        message: error.message,
                      });
                    })
                    .finally(() => {
                      // actions.setLoadingFalse();
                    });
                }
              });
          });
      } else {
        if (auth.isGuest === true) {
          if (auth.user === null) {
            if (auth.addresses.length > 0) {
              navigation.navigate('Main', {
                screen: 'DrawerStack',
                params: {screen: 'Catalogue'},
              });
            } else {
              navigation.navigate('Main', {
                screen: 'DrawerStack',
                params: {screen: 'ViewCatalogue'},
              });
            }
          } else {
            actions.saveUserData(null);
            actions.saveProfile(null);
            actions.saveAddresses([
              {
                id: null,
                address: null,
                district_id: null,
                longitude: null,
                latitude: null,
                entrance: null,
                intercom: null,
                apt_office: null,
                floor: null,
                comments: null,
                active: null,
                district: null,
              },
            ]);
            actions.setActiveAddress({
              id: null,
              address: null,
              district_id: null,
              longitude: null,
              latitude: null,
              entrance: null,
              intercom: null,
              apt_office: null,
              floor: null,
              comments: null,
              active: null,
              district: null,
            });
          }
        } else {
          if (auth.welcomeSeen) {
            // navigation.navigate('SignIn');
            setTimeout(() => {
              navigation.navigate('SignIn');
            }, 500);
          } else {
            setTimeout(() => {
              navigation.navigate('Walkthrough');
            }, 500);
          }
        }
      }
    });
  };

  componentWillUnmount() {
    if (this.unsubscribeAuthState) {
      this.unsubscribeAuthState();
    }
  }

  saveCart = (access_token) => {
    const {auth, navigation, actions} = this.props;
    const body = {
      company_id: auth.partner.id,
      products: auth.cart,
    };
    UserServices.addToCart(access_token, body)
      .then((response) => {
        if (response.data.success === 1) {
          this.setState({loading: true});
          UserServices.getCart(access_token)
            .then((response) => {
              if (response.data.success === 1) {
                const cart = response.data.data.cart;
                this.setState({cart: cart});
              } else {
                console.error(
                  'something went wrong while getting cart',
                  response.data.message,
                );
              }
            })
            .catch((err) => {
              console.error('err in getting cart 3', err);
            })
            .finally(() => {
              this.setState({loading: false});
            });
          actions.clearCart();
          actions.clearDeliveryDay();
        } else {
          console.error(
            'something went wrong while adding purchase to cart',
            response.data.message,
          );
          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err in adding to cart savecart', err);
        navigation.navigate('ErrorScreen', {
          message: err.message,
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  addGuestAddress(userAddressArray, guestAddressArray) {
    let flag = false;
    let newGuestAddressArray = [];
    guestAddressArray.forEach((guestAddr, index) => {
      flag = false;
      userAddressArray.forEach((userAddr, ind) => {
        if (userAddr.address === guestAddr.address) {
          flag = true;
        }
      });
      if (!flag) {
        newGuestAddressArray.push(guestAddr);
      }
    });
    return newGuestAddressArray;
  }

  handleLogin(phoneNumber, token) {
    const {auth, actions, navigation} = this.props;

    actions.setLoadingTrue();
    const body = {
      phone: phoneNumber,
      device_token: token,
    };
    let accessToken;
    UserServices.login(body)
      .then((response) => {
        if (response.data.success === 1) {
          actions.clearDiscountPrice();
          // actions.clearCart();
          // actions.saveProducts([]);
          localStorageService.setToken(response.data.data.access_token);
          accessToken = response.data.data.access_token;

          actions.saveUserData({
            phoneNumber: phoneNumber,
            token: token,
            access_token: accessToken,
            user: response.data.data.user,
          });
          let addAddressBody;

          actions.setLoadingTrue();
          UserServices.getAddress(accessToken)
            .then(async (response) => {
              if (response.data.success === 1) {
                if (response.data.data.length > 0) {
                  // ----------------------------------------- //
                  // check if any of guest's address is duplicated in user's address and add only new addresses.
                  let newAddressArray = this.addGuestAddress(
                    response.data.data,
                    auth.addresses,
                  );

                  if (newAddressArray.length !== 0) {
                    await newAddressArray.forEach((item, index) => {
                      addAddressBody = {
                        address: item.address,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        entrance: item.entrance,
                        intercom: item.intercom,
                        apt_office: item.apt_office,
                        floor: item.floor,
                        comments: item.comments,
                        active:
                          auth.activeAddress.address === item.address ? 1 : 0,
                        district:
                          item.district !== null
                            ? item.district
                            : 'Алексеевский',
                      };
                      actions.setLoadingTrue();
                      UserServices.addAddress(addAddressBody, accessToken)
                        .then((response) => {
                          if (response.data.success === 1) {
                          } else {
                            console.error(
                              'something went wrong while adding an address',
                              response.data.message,
                            );
                            navigation.navigate('ErrorScreen', {
                              message: response.data.message,
                            });
                          }
                        })
                        .catch((err) => {
                          console.error('err while adding an address 1', err);

                          actions.setLoadingFalse();
                          navigation.navigate('ErrorScreen', {
                            from: 'Loading',
                            message: err.message,
                          });
                        })
                        .finally(() => {
                          // actions.setLoadingFalse();
                        });
                    });
                  }

                  // ----- Get my addresses again ------------ //
                  UserServices.getAddress(accessToken)
                    .then((response) => {
                      actions.saveAddresses(response.data.data);
                      actions.setActiveAddress(
                        response.data.data.find((item) => item.active === 1),
                      );
                      if (auth.payment) {
                        actions.setPaymentFalse();
                        actions.setLoadingFalse();
                        const body = {
                          company_id: auth.partner.id,
                          products: auth.cart,
                        };
                        UserServices.addToCart(accessToken, body)
                          .then((response) => {
                            if (response.data.success === 1) {
                              this.setState({loading: true});
                              UserServices.getCart(accessToken)
                                .then((response) => {
                                  if (response.data.success === 1) {
                                    actions.setCart(
                                      response.data.data.cart.products,
                                    );
                                    setTimeout(() => {
                                      navigation.navigate('Main', {
                                        screen: 'DrawerStack',
                                        params: {
                                          screen: 'Payment',
                                          params: {cart: null},
                                        },
                                      });
                                    }, 500);
                                  } else {
                                    console.error(
                                      'something went wrong while getting cart',
                                      response.data.message,
                                    );
                                  }
                                })
                                .catch((err) => {
                                  console.error('err in getting cart 3', err);
                                })
                                .finally(() => {
                                  this.setState({loading: false});
                                });
                              actions.clearCart();
                              actions.clearDeliveryDay();
                            } else {
                              console.error(
                                'something went wrong while adding purchase to cart',
                                response.data.message,
                              );
                              navigation.navigate('ErrorScreen', {
                                message: response.data.message,
                              });
                            }
                          })
                          .catch((err) => {
                            console.error(
                              'err in adding to cart savecart',
                              err,
                            );
                            navigation.navigate('ErrorScreen', {
                              message: err.message,
                            });
                          })
                          .finally(() => {
                            this.setState({loading: false});
                          });
                      } else {
                        navigation.navigate('Main', {
                          screen: 'DrawerStack',
                          params: {screen: 'Catalogue'},
                        });
                      }
                    })
                    .catch((err) => {
                      console.error('err while getting addresses 1', err);

                      actions.setLoadingFalse();
                      navigation.navigate('ErrorScreen', {
                        from: 'Loading',
                        message: err.message,
                      });
                    });
                  // ----------------------------------------- //
                } else if (
                  response.data.data.length === 0 &&
                  auth.addresses.length > 0
                ) {
                  // ----------------------------------------- //
                  // ----- No my addresses, so just add guest addresses ----- //
                  auth.addresses.forEach((item, index) => {
                    addAddressBody = {
                      address: item.address,
                      latitude: item.latitude,
                      longitude: item.longitude,
                      entrance: item.entrance,
                      intercom: item.intercom,
                      apt_office: item.apt_office,
                      floor: item.floor,
                      comments: item.comments,
                      active:
                        auth.activeAddress.address === item.address ? 1 : 0,
                      district:
                        item.district !== null ? item.district : 'Алексеевский',
                    };
                    actions.setLoadingTrue();
                    UserServices.addAddress(addAddressBody, accessToken)
                      .then((response) => {
                        if (response.data.success === 1) {
                        } else {
                          console.error(
                            'something went wrong while adding an address',
                            response.data.message,
                          );
                          navigation.navigate('ErrorScreen', {
                            message: response.data.message,
                          });
                        }
                      })
                      .catch((err) => {
                        console.error('err while adding an address 2', err);

                        actions.setLoadingFalse();
                        navigation.navigate('ErrorScreen', {
                          from: 'Loading',
                          message: err.message,
                        });
                      })
                      .finally(() => {
                        // actions.setLoadingFalse();
                      });
                  });
                  // ----------------------------------------- //

                  // ----- Get my addresses again ------------ //
                  UserServices.getAddress(accessToken)
                    .then((response) => {
                      actions.saveAddresses(response.data.data);
                      actions.setActiveAddress(
                        response.data.data.find((item) => item.active === 1),
                      );
                      if (auth.payment) {
                        actions.setPaymentFalse();
                        actions.setLoadingFalse();
                        const body = {
                          company_id: auth.partner.id,
                          products: auth.cart,
                        };
                        UserServices.addToCart(accessToken, body)
                          .then((response) => {
                            if (response.data.success === 1) {
                              this.setState({loading: true});
                              UserServices.getCart(accessToken)
                                .then((response) => {
                                  if (response.data.success === 1) {
                                    actions.setCart(
                                      response.data.data.cart.products,
                                    );
                                    setTimeout(() => {
                                      navigation.navigate('Main', {
                                        screen: 'DrawerStack',
                                        params: {
                                          screen: 'Payment',
                                          params: {cart: null},
                                        },
                                      });
                                    }, 500);
                                  } else {
                                    console.error(
                                      'something went wrong while getting cart',
                                      response.data.message,
                                    );
                                  }
                                })
                                .catch((err) => {
                                  console.error('err in getting cart 3', err);
                                })
                                .finally(() => {
                                  this.setState({loading: false});
                                });
                              actions.clearCart();
                              actions.clearDeliveryDay();
                            } else {
                              console.error(
                                'something went wrong while adding purchase to cart',
                                response.data.message,
                              );
                              navigation.navigate('ErrorScreen', {
                                message: response.data.message,
                              });
                            }
                          })
                          .catch((err) => {
                            console.error(
                              'err in adding to cart savecart',
                              err,
                            );
                            navigation.navigate('ErrorScreen', {
                              message: err.message,
                            });
                          })
                          .finally(() => {
                            this.setState({loading: false});
                          });
                      } else {
                        navigation.navigate('Main', {
                          screen: 'DrawerStack',
                          params: {screen: 'Catalogue'},
                        });
                      }
                    })
                    .catch((err) => {
                      console.error('err while getting addresses 1', err);

                      actions.setLoadingFalse();
                      navigation.navigate('ErrorScreen', {
                        from: 'Loading',
                        message: err.message,
                      });
                    });
                  // ----------------------------------------- //
                } else {
                  navigation.navigate('Main', {
                    screen: 'DrawerStack',
                    params: {screen: 'ViewCatalogue'},
                  });
                }
              } else {
                console.error(
                  'sth went wrong while getting addresses',
                  response.data.message,
                );

                actions.setLoadingFalse();
                navigation.navigate('ErrorScreen', {
                  from: 'Loading',
                  message: response.data.message,
                });
              }
            })
            .catch((err) => {
              console.error('err while getting addresses', err);

              actions.setLoadingFalse();
              navigation.navigate('ErrorScreen', {
                from: 'Loading',
                message: err.message,
              });
            })
            .finally(() => {
              // actions.setLoadingFalse();
            });
        } else {
          console.error('Something went wrong in Login', response.data.message);

          actions.setLoadingFalse();
          navigation.navigate('ErrorScreen', {
            from: 'Loading',
            message: response.data.message,
          });
        }
      })
      .catch((error) => {
        actions.setLoadingFalse();
        console.error('err in login', error);

        navigation.navigate('ErrorScreen', {
          from: 'Loading',
          message: error.message,
        });
      })
      .finally(() => {});
  }

  render() {
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />

        <View style={styles.container}>
          <Header title="Local Market" whiteHeaderColor />
          <View style={styles.mainContainer}>
            <Splash
              width={(Dimensions.get('window').width * 4) / 3}
              height={(Dimensions.get('window').height * 2) / 3}
            />
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={'#FF2D34'}
                style={styles.loading}
              />
            </View>
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
