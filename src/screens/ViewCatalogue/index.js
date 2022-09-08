import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '@actions';
import { View, Dimensions, StatusBar, Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { Text, SafeAreaView, Header } from '@components';
import styles from './styles';
import { BaseColor, BaseSize, BaseStyle } from '@config';
import Spinner from 'react-native-loading-spinner-overlay';
import ViewCatalogueSvg from '../../assets/svgs/viewCatalogue.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserServices } from '../../services';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

class ViewCatalogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      scrollEnabled: true,
      prevIndex: 0,
      slideSize: Dimensions.get('window').width - 80,
    };
  }

  componentDidMount() {
    const { actions, auth, navigation } = this.props;
    actions.setLoadingFalse();
    if (auth?.user !== null) {
      this.setState({ loading: true });
      UserServices.getAddress(auth?.user?.access_token)
        .then((response) => {
          if (response?.data?.success === 1) {
            const data = response?.data?.data;
            actions.saveAddresses(data);
            if (data.find((val) => val?.active === 1) !== undefined) {
              actions.setActiveAddress(data.find((val) => val?.active === 1));
            }
          } else {
            console.error('something went wrong', response3?.data?.message);
            navigation.navigate('ErrorScreen', {
              message: response3?.data?.message,
            });
          }
        })
        .catch((err) => {
          console.error('err while fetching addresses info', err);

          navigation.navigate('ErrorScreen', { message: err.message });
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }

  onSkip = () => {
    this.props.navigation.navigate('SignIn');
  };

  onAddAddressBtn = () => {
    const { navigation } = this.props;
    // geolocation permission
    if (Platform.OS === 'ios') {
      try {
        checkMultiple([
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ])
          .then((statuses) => {
            if (
              statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] !==
                'granted' &&
              statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] !== 'granted'
            ) {
              requestMultiple([
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                PERMISSIONS.IOS.LOCATION_ALWAYS,
              ])
                .then((statuses) => {
                  if (
                    statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                      'granted' ||
                    statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                      'granted'
                  ) {
                    navigation.navigate('SearchAddress');
                  } else if (
                    statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                      'denied' ||
                    statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                      'denied'
                  ) {
                  }
                })
                .catch((err) => {
                  console.error(
                    'Error in requesting geolocation permission',
                    err,
                  );
                });
            } else {
              navigation.navigate('SearchAddress');
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
              statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !==
                'granted' &&
              statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== 'granted'
            ) {
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
                    navigation.navigate('SearchAddress');
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
                });
            } else {
              navigation.navigate('SearchAddress');
            }
          })
          .catch((err) => {
            console.error('Error in chechMultiple request', err);
          });
      } catch (error) {
        console.error('error in checking multiple permissions', error);
      }
    }
  };

  renderSpinner = (loading) => {
    return <Spinner visible={loading} color="#FF2D34" />;
  };

  render() {
    const { slideSize, loading } = this.state;
    return (
      <>
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          forceInset={{ top: 'never' }}>
          <StatusBar
            hidden={false}
            barStyle="dark-content"
            backgroundColor="white"
          />
          {this.renderSpinner(loading)}
          <View style={styles.contain}>
            <Header
              title="Добавьте адрес"
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
                const { auth, navigation } = this.props;
                navigation.openDrawer();
              }}
            />
            <View style={{ marginTop: 10, flex: 1 }}>
              <View style={{ alignItems: 'center' }}>
                <ViewCatalogueSvg width={slideSize} height={slideSize} />
                <Text title2 style={{ marginTop: 30 }}>
                  {'Посмотрите каталог'}
                </Text>
                <Text body2 style={{ marginTop: 20 }}>
                  {'Мы покажем вам подходящие магазины'}
                </Text>
                <TouchableOpacity
                  onPress={this.onAddAddressBtn}
                  style={[
                    styles.addBtn,
                    { backgroundColor: BaseColor.redColor },
                  ]}>
                  <Text middleBody style={{ color: BaseColor.whiteColor }}>
                    {'Добавить'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalogue);
