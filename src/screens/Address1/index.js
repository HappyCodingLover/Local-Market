import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {bindActionCreators} from 'redux';
import {
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import {UserServices} from '../../services';
import {showMessage} from 'react-native-flash-message';

import {BaseColor, BaseSize} from '@config';
import {SafeAreaView, Text, Icon, Header} from '@components';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import NoAddress from '../../assets/svgs/noAddress.svg';
import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class Address1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      addresses: [],
      activeAddress: null,
      selectedIndex: 0,
      slideSize: Dimensions.get('window').height / 2,
      activeAddressId: 0,
      token: '60d2678d4b84bf022b27ee643f49d1b1f86290b8',
      query: 'moscow khabar',
      suggestions: [],
    };
  }

  onFocus = () => {
    const {auth, actions, navigation} = this.props;
    this.setState({
      addresses: auth?.addresses,
    });
    if (auth?.activeAddress != null) {
      this.setState({
        selectedIndex: auth?.addresses
          .reduce((res, item) => {
            return [...res, item?.address];
          }, [])
          .indexOf(auth?.activeAddress?.address),
      });
    } else {
      if (auth?.addresses?.length !== 0) {
        actions.setActiveAddress(auth?.addresses[0]);
        navigation.navigate('Catalogue');
      }
    }
  };

  onAddAddressBtn = () => {
    // geolocation permission
    if (Platform.OS === 'ios') {
      try {
        checkMultiple([
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ])
          .then((statuses) => {
            if (
              statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === 'granted' ||
              statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] === 'granted'
            ) {
              if (this.props.route.params !== undefined) {
                this.props.navigation.navigate('SearchAddress', {
                  from: 'Payment',
                });
              } else {
                this.props.navigation.navigate('SearchAddress');
              }
            } else {
              requestMultiple([
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                PERMISSIONS.IOS.LOCATION_ALWAYS,
              ])
                .then((statuses) => {
                  if (
                    statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                      'granted' ||
                    statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] === 'granted'
                  ) {
                    if (this.props.route.params !== undefined) {
                      this.props.navigation.navigate('SearchAddress', {
                        from: 'Payment',
                      });
                    } else {
                      this.props.navigation.navigate('SearchAddress');
                    }
                  } else if (
                    statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                      'denied' ||
                    statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] === 'denied'
                  ) {
                  }
                })
                .catch((err) => {
                  console.error(
                    'Error in requesting geolocation permission',
                    err,
                  );
                });
            }
          })
          .catch((err) => {
            console.error('Error in chechMultiple request', err);
          });
      } catch (error) {
        console.error('error in checking multiple permissions', error);
      }
    } else {
      try {
        checkMultiple([
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ])
          .then((statuses) => {
            if (
              statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] ===
                'granted' ||
              statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted'
            ) {
              if (this.props.route.params !== undefined) {
                this.props.navigation.navigate('SearchAddress', {
                  from: 'Payment',
                });
              } else {
                this.props.navigation.navigate('SearchAddress');
              }
            } else {
              requestMultiple([
                PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              ])
                .then((statuses) => {
                  if (
                    statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] ===
                      'granted' ||
                    statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
                      'granted'
                  ) {
                    if (this.props.route.params !== undefined) {
                      this.props.navigation.navigate('SearchAddress', {
                        from: 'Payment',
                      });
                    } else {
                      this.props.navigation.navigate('SearchAddress');
                    }
                  } else if (
                    statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] ===
                      'denied' ||
                    statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
                      'denied'
                  ) {
                  }
                })
                .catch((err) => {
                  console.error(
                    'Error in requesting geolocation permission',
                    err,
                  );
                  Alert.alert(err);
                });
            }
          })
          .catch((err) => {
            console.error('Error in chechMultiple request android', err);
            Alert.alert(err);
          });
      } catch (error) {
        console.error('error in checking multiple permissions', error);
        Alert.alert(error);
      }
    }
  };

  handleChecked = (index) => {
    this.setState({
      activeAddress: this.props.auth?.addresses[index],
      selectedIndex: index,
      activeAddressId: this.props.auth?.addresses[index]?.id,
    });
  };

  handleGuest = () => {
    const {auth, actions, navigation} = this.props;
    const {selectedIndex} = this.state;
    actions.setActiveAddress(auth?.addresses[selectedIndex]);
    navigation.openDrawer();
  };

  saveActiveAddress = () => {
    const {auth, navigation, actions} = this.props;
    const {activeAddressId, selectedIndex} = this.state;
    if (auth?.user === null) {
      actions.setActiveAddress(auth?.addresses[selectedIndex]);
      actions.clearCart();
      actions.clearDeliveryDay();
      actions.clearPartner();
      actions.clearTotalPrice();
      actions.clearDiscountPrice();
      navigation.openDrawer();
    } else {
      if (auth?.activeAddress?.id !== auth?.addresses[selectedIndex]?.id) {
        const body = {
          active: 1,
          id: auth?.addresses[selectedIndex]?.id,
        };
        this.setState({loading: true});
        UserServices.editAddress(body, auth?.user?.access_token)
          .then((response) => {
            if (response.data.success === 1) {
              actions.setActiveAddress(auth?.addresses[selectedIndex]);
              actions.clearCart();
              actions.clearDeliveryDay();
              actions.clearPartner();
              actions.clearTotalPrice();
              actions.clearDiscountPrice();
              navigation.openDrawer();
            } else {
              console.error(
                'something went wrong while editting address',
                response.data.message,
              );
              this.setState({loading: false});
              navigation.navigate('ErrorScreen', {
                message: response.data.message,
              });
            }
          })
          .catch((err) => {
            console.error('err in editting address', err);
            showMessage({
              message:
                'Отсутствует соединение с Интернетом. Изменения не были сохранены.',
              type: 'warning',
              icon: 'auto',
              duration: 5000,
            });
            navigation.navigate('ErrorScreen', {
              message: err.message,
            });
          })
          .finally(() => {
            this.setState({loading: false});
          });
      } else {
        navigation.openDrawer();
      }
    }
  };

  render() {
    const {loading, selectedIndex, slideSize} = this.state;
    const {t, auth} = this.props;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <SafeAreaView style={{flex: 7}} forceInset={{top: 'never'}}>
            <Spinner visible={loading} color="#FF2D34" />
            <StatusBar
              hidden={false}
              barStyle="dark-content"
              backgroundColor="white"
            />
            <View style={styles.contain}>
              <Header
                title={'Адреса'}
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
                  if (auth?.addresses?.length === 0) {
                    this.handleGuest();
                  } else {
                    this.saveActiveAddress();
                  }
                }}
              />
              <View style={{marginTop: 10, flex: 1}}>
                {auth?.addresses?.length !== 0 &&
                auth?.activeAddress !== undefined &&
                auth?.activeAddress?.id !== null ? (
                  <View style={{flex: 1}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      style={styles.addressList}
                      data={auth?.addresses.filter(
                        (address) => address?.id !== null,
                      )}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          style={styles.addressRow}
                          onPress={() => {
                            this.handleChecked(index);
                          }}>
                          <View style={styles.addressView}>
                            <Text subhead numberOfLines={2}>
                              {item?.address}
                            </Text>
                          </View>
                          <View style={styles.checkBoxView}>
                            <View
                              style={[
                                styles.check,
                                selectedIndex === index && {
                                  backgroundColor: BaseColor.redColor,
                                },
                              ]}>
                              <Icon name="check" color="white" size={12} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                ) : (
                  // noAddress
                  <View style={{alignItems: 'center'}}>
                    <NoAddress width={slideSize} height={slideSize} />
                    <Text title1>{'У вас ещё нет адресов'}</Text>
                    <Text
                      middleBody
                      grayColor
                      style={{
                        marginTop: 10,
                        textAlign: 'center',
                        marginHorizontal: 40,
                        lineHeight: 24,
                      }}>
                      {
                        'Найдите магазин поблизости, выберите товары и сделайте заказ'
                      }
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </SafeAreaView>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: 50,
            }}>
            <TouchableOpacity
              onPress={this.onAddAddressBtn}
              style={[styles.saveBtn, {backgroundColor: BaseColor.redColor}]}>
              <Text middleBody style={{color: BaseColor.whiteColor}}>
                {'Добавить адрес'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Address1);
