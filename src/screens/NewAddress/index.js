import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {bindActionCreators} from 'redux';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import {BaseStyle, BaseColor, BaseSize} from '@config';
import {SafeAreaView, Text, Header} from '@components';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {UserServices} from '../../services';

import {useFocusEffect} from '@react-navigation/native';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}
class NewAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      entrance: '',
      intercom: '',
      apt: '',
      floor: '',
      comments: '',
      loading: false,
    };
  }

  onFocus = () => {
    this.setState({
      address: this.props.route.params.address,
    });
  };

  onSaveBtn = () => {
    const {address, entrance, intercom, apt, floor, comments} = this.state;
    const {auth, actions, navigation, route} = this.props;
    const addressInfo = {
      address:
        address.street_with_type +
        ', ' +
        address.house_type +
        ' ' +
        address.house +
        (address.settlement_with_type !== null
          ? ', ' + address.settlement_with_type
          : ''),
      latitude: address.geo_lat,
      longitude: address.geo_lon,
      district: address.city_district
        ? address.city_district
        : address.federal_district,
      entrance: entrance,
      intercom: intercom,
      apt_office: apt,
      floor: floor,
      comments: comments,
    };
    if (
      auth.activeAddress !== null &&
      auth.activeAddress !== undefined &&
      auth.activeAddress.id === null
    ) {
      actions.saveAddresses([]);
    }
    if (auth.user) {
      // add this new address to the backend
      const body = {
        address:
          address.street_with_type +
          ', ' +
          address.house_type +
          ' ' +
          address.house +
          (address.settlement_with_type !== null
            ? ', ' + address.settlement_with_type
            : ''),
        latitude: address.geo_lat,
        longitude: address.geo_lon,
        district: address.city_district
          ? address.city_district
          : address.federal_district,
        entrance: entrance,
        intercom: intercom,
        apt_office: apt,
        floor: floor,
        comments: comments,
        active: 1,
      };
      this.setState({loading: true});

      UserServices.addAddress(body, auth.user.access_token)
        .then((response) => {
          if (response.data.success === 1) {
            this.setState({loading: true});
            UserServices.getAddress(auth.user.access_token)
              .then((response1) => {
                if (response1.data.success === 1) {
                  actions.saveAddresses(response1.data.data);
                  actions.setActiveAddress(
                    response1.data.data.find((item) => item.active === 1),
                  );
                  if (route.params.from === 'Payment') {
                    navigation.navigate('Payment');
                  } else {
                    navigation.navigate('DrawerStack', {
                      screen: 'Catalogue',
                    });
                  }
                } else {
                  console.error('something went wrong', response1.data.message);
                  this.setState({loading: false});
                  navigation.navigate('ErrorScreen', {
                    message: response1.data.message,
                  });
                }
              })
              .catch((err) => {
                console.error('err2 in getting addresses', err);
                this.setState({loading: false});
                navigation.navigate('ErrorScreen', {message: err.message});
              })
              .finally(() => {
                actions.setLoadingFalse();
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
          console.error('err in adding address___', err);
          if (err.message === 'Request failed with status code 422') {
            const body1 = {
              address:
                address.street_with_type +
                ', ' +
                address.house_type +
                ' ' +
                address.house +
                (address.settlement_with_type !== null
                  ? ', ' + address.settlement_with_type
                  : ''),
              latitude: address.geo_lat,
              longitude: address.geo_lon,
              district: 'Москва',
              entrance: entrance,
              intercom: intercom,
              apt_office: apt,
              floor: floor,
              comments: comments,
              active: 1,
            };
            UserServices.addAddress(body1, auth.user.access_token)
              .then((response) => {
                if (response.data.success === 1) {
                  this.setState({loading: true});
                  UserServices.getAddress(auth.user.access_token)
                    .then((response1) => {
                      if (response1.data.success === 1) {
                        actions.saveAddresses(response1.data.data);
                        actions.setActiveAddress(
                          response1.data.data.find((item) => item.active === 1),
                        );
                        if (route.params.from === 'Payment') {
                          navigation.navigate('Payment');
                        } else {
                          navigation.navigate('DrawerStack', {
                            screen: 'Catalogue',
                          });
                        }
                      } else {
                        console.error(
                          'something went wrong',
                          response1.data.message,
                        );
                        this.setState({loading: false});
                        navigation.navigate('ErrorScreen', {
                          message: response1.data.message,
                        });
                      }
                    })
                    .catch((err) => {
                      console.error('err2 in getting addresses', err);
                      this.setState({loading: false});
                      navigation.navigate('ErrorScreen', {
                        message: err.message,
                      });
                    })
                    .finally(() => {
                      actions.setLoadingFalse();
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
                console.error('err in adding address', err);
                this.setState({loading: false});
                navigation.navigate('ErrorScreen', {message: err.message});
              })
              .finally(() => {});
          } else {
            console.error('err in adding address', err);
            this.setState({loading: false});
            console.error('err in adding address', err);

            navigation.navigate('ErrorScreen', {message: err.message});
          }
        })
        .finally(() => {});
    } else {
      // guest mode
      actions.registerNewAddress(addressInfo);
      actions.setActiveAddress(addressInfo);
      if (auth.addresses.length === 0) {
        navigation.navigate('DrawerStack', {
          screen: 'Catalogue',
        });
      } else {
        navigation.navigate('Address1');
      }
    }
  };

  checkInput = () => {
    const {address, apt} = this.state;
    if (address === '' || apt === '') return false;
    else return true;
  };

  renderSpinner = (loading) => {
    return <Spinner visible={loading} color="#FF2D34" />;
  };

  render() {
    const {loading, address} = this.state;
    const {auth} = this.props;
    const {t, navigation} = this.props;

    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          forceInset={{top: 'never'}}>
          {this.renderSpinner(loading)}
          <StatusBar
            hidden={false}
            barStyle="dark-content"
            backgroundColor="white"
          />
          <View style={styles.contain}>
            <Header
              title={'Новый адрес'}
              renderLeft={() => {
                return (
                  <FeatherIcon
                    name="chevron-left"
                    size={BaseSize.headerIconSize}
                    color={BaseColor.redColor}
                  />
                );
              }}
              onPressLeft={() => {
                navigation.goBack();
              }}
            />
            <KeyboardAwareScrollView
              style={styles.mainContainer}
              contentContainerStyle={{justifyContent: 'space-between'}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={{flex: 1}}>
                <Text lightGrayColor>{'Адрес'}</Text>
                <Text style={styles.textInput}>
                  {address.street_with_type +
                    ', ' +
                    address.house_type +
                    ' ' +
                    address.house +
                    (address.settlement_with_type !== null
                      ? ', ' + address.settlement_with_type
                      : '')}
                </Text>
                <Text lightGrayColor>{'Подъезд'}</Text>
                <TextInput
                  multiline={true}
                  placeholder="Укажите подъезд"
                  style={styles.textInput}
                  onChangeText={(text) => {
                    this.setState({entrance: text});
                  }}
                />
                <Text lightGrayColor>{'Домофон'}</Text>
                <TextInput
                  multiline={true}
                  placeholder="Укажите домофон"
                  style={styles.textInput}
                  onChangeText={(text) => {
                    this.setState({intercom: text});
                  }}
                />
                <Text lightGrayColor>{'Кв/офис'}</Text>
                <TextInput
                  multiline={true}
                  placeholder="Укажите кв/офис"
                  style={styles.textInput}
                  onChangeText={(text) => {
                    this.setState({apt: text});
                  }}
                />
                <Text lightGrayColor>{'Этаж'}</Text>
                <TextInput
                  multiline={true}
                  placeholder="Укажите этаж"
                  style={styles.textInput}
                  onChangeText={(text) => {
                    this.setState({floor: text});
                  }}
                />
                <Text lightGrayColor>{'Комментарий курьеру'}</Text>
                <TextInput
                  multiline={true}
                  placeholder="Укажите комментарий"
                  style={styles.textInput}
                  onChangeText={(text) => {
                    this.setState({comments: text});
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={this.onSaveBtn}
                disabled={!this.checkInput()}
                style={[
                  styles.saveBtn,
                  this.checkInput()
                    ? {backgroundColor: BaseColor.redColor}
                    : {backgroundColor: BaseColor.textInputBackgroundColor},
                ]}>
                <Text
                  middleBody
                  style={
                    this.checkInput()
                      ? {color: BaseColor.whiteColor}
                      : {color: BaseColor.placeholderColor}
                  }>
                  {'Сохранить'}
                </Text>
              </TouchableOpacity>
           
            </KeyboardAwareScrollView>
            <View style={styles.bottomContainer}>
               </View>
          </View>
        </SafeAreaView>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewAddress);
