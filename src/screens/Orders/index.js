import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {View, Dimensions, FlatList, Alert, ImageBackground} from 'react-native';
import {bindActionCreators} from 'redux';
import {SafeAreaView, Header, Image, Text} from '@components';
import styles from './styles';
import {BaseColor, Images, BaseSize} from '@config';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import NoOrdersSvg from '../../assets/svgs/noOrders.svg';
import {UserServices} from '../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import FeatherIcon from 'react-native-vector-icons/Feather';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGuestMode: false,
      orders: [],
      loading: false,
      loaded: false,
      slideSize: Dimensions.get('window').height / 2,
      showScreen: false,
      messages: [
        {
          id: 0,
          status: 'Создан',
          msg: 'Заказ создан',
          text: 'Мы сообщим, когда его начнут собирать',
        },
        {
          id: 1,
          status: 'Принят',
          msg: 'Заказ принят',
          text: 'Мы сообщим, когда его начнут собирать',
        },
        {
          id: 2,
          status: 'Собирается',
          msg: 'Заказ собирается',
          text: 'Мы сообщим, когда его передадут в доставку',
        },
        {
          id: 3,
          status: 'У курьера',
          msg: 'Заказ у курьера',
          text: 'Курьер скоро свяжется с вами',
        },
        {
          id: 4,
          status: 'Доставлен',
          msg: 'Заказ доставлен',
          text: 'Спасибо за покупку!',
        },
        {
          id: 5,
          status: 'Отменен',
          msg: 'Заказ был отменен',
          text:
            'Ваш заказ был отменен, свяжитесь с нами, если возникли вопросы',
        },
      ],
    };
  }

  onFocus = () => {
    const {auth, actions, navigation} = this.props;
    if (auth.user === null) {
      // guest mode
      this.setState({loaded: true, isGuestMode: true});
      // Alert.alert(
      //   'Хотите посмотреть свои заказы?',
      //   'Сначала войдите в систему.',
      //   [
      //     {
      //       text: 'Нет',
      //       onPress: () => {
      //         navigation.goBack();
      //       },
      //       style: 'cancel',
      //     },
      //     {
      //       text: 'Да',
      //       onPress: () => {
      //         actions.setGuestTrue();
      //         navigation.push('SignIn', { from: 'Orders' });
      //       },
      //     },
      //   ],
      // );
    } else {
      this.setState({showScreen: true});
      this.setState({loading: true});
      UserServices.getOrder(auth.user.access_token)
        .then((response) => {
          if (response.data.success === 1) {
            actions.saveOrders(response.data.data);
            this.setState({orders: response.data.data});
          } else {
            console.error(
              'something went wrong while getting orders',
              response.data.message,
            );
            this.setState({loading: false});
            console.error('errorScreen 19', response.data.message);

            navigation.navigate('ErrorScreen', {
              message: response.data.message,
            });
          }
        })
        .catch((err) => {
          console.error('err in getting orders', err);
          this.setState({loading: false});
          console.error('errorScreen 20', err);

          navigation.navigate('ErrorScreen', {message: err.message});
        })
        .finally(() => {
          this.setState({loading: false, loaded: true});
        });
    }
  };

  renderOrderDetailsView(item, index) {
    return (
      <View style={styles.orderDetailsView}>
        <View style={{flex: 1}}>
          <Text grayColor subhead>
            {item?.product_count} {'x'}
          </Text>
        </View>
        <View style={{flex: 7}}>
          <Text subhead numberOfLines={1}>
            {item?.product?.name}
          </Text>
        </View>
        <View style={{flex: 2}}>
          <Text subhead style={{textAlign: 'right'}}>
            {item?.order_price} {'₽'}
          </Text>
        </View>
      </View>
    );
  }

  renderOrderView(item, index) {
    const {auth} = this.props;
    if (
      auth.addresses.find((val) => val.id === item.user_address_id) !==
      undefined
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('OrdersStatus', {id: item.id});
          }}
          style={styles.order}>
          <View style={styles.orderItem}>
            <ImageBackground
              source={Images.productPlaceholder}
              imageStyle={{borderRadius: 10}}
              style={styles.partnerImgBackground}>
              <Image
                source={{uri: item.company.logo_url}}
                style={styles.orderItemImg}
              />
            </ImageBackground>
            <View style={styles.orderImageInfo}>
              <View style={styles.orderInfo}>
                <Text body1 numberOfLines={1}>
                  {item.company.name}
                </Text>
                <Text body2 numberOfLines={1}>
                  {(item.delivery_day === 0 ? 'Cегодня ' : 'Завтра ') +
                    item.delivery_timeframe.start +
                    ' ~ ' +
                    item.delivery_timeframe.end}
                </Text>
                <Text body2 numberOfLines={1} grayColor>
                  {auth.addresses.length !== 0 &&
                    auth.addresses.find(
                      (val) => val.id === item.user_address_id,
                    ).address}
                </Text>
              </View>
            </View>
            <View style={styles.orderItemStatusPrice}>
              <Text
                style={[
                  styles.orderItemStatus,
                  {
                    color:
                      item.status === 4
                        ? BaseColor.successColor
                        : item.status === 0 ||
                          item.status === 1 ||
                          item.status === 2 ||
                          item.status === 3
                        ? BaseColor.processingColor
                        : BaseColor.cancelColor,
                  },
                ]}>
                {item.status === 0
                  ? 'Создан'
                  : item.status === 1
                  ? 'Принят'
                  : item.status === 2
                  ? 'Собирается'
                  : item.status === 3
                  ? 'У курьера'
                  : item.status === 4
                  ? 'Доставлен'
                  : 'Отменен'}
              </Text>
              <Text style={styles.orderItemPrice}>
                {item.order_price} {'₽'}
              </Text>
            </View>
          </View>
          {item.products.length !== 0 && (
            <View style={styles.orderDetails}>
              <FlatList
                data={item.products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) =>
                  this.renderOrderDetailsView(item, index)
                }
              />
            </View>
          )}
        </TouchableOpacity>
      );
    }
  }

  onReturnBtn = () => {
    const {navigation} = this.props;
    if (this.props.auth.activeAddress) {
      this.props.navigation.navigate('Catalogue');
    } else {
      Alert.alert(
        'Вы еще не добавили адреса.',
        'Нам нужен ваш адрес, чтобы показать партнерам.',
        [
          {
            text: 'Да',
            onPress: () => {
              navigation.navigate('Address1');
            },
          },
        ],
      );
    }
  };

  render() {
    const {slideSize, loading, orders, loaded, isGuestMode} = this.state;
    const {navigation} = this.props;
    return (
      <AndroidBackHandler
        onBackPress={() => {
          this.props.navigation.navigate('Main', {
            screen: 'DrawerStack',
            params: {screen: 'Catalogue'},
          });
          return true;
        }}>
        <FocusEfect onFocus={this.onFocus} />
        <SafeAreaView style={styles.contain} forceInset={{top: 'never'}}>
          <Spinner visible={loading} color="#FF2D34" />
          <Header
            title="Заказы"
            renderLeft={() => {
              if (isGuestMode) {
                return (
                  <FeatherIcon
                    name="chevron-left"
                    size={BaseSize.headerIconSize}
                    color={BaseColor.redColor}
                  />
                );
              } else {
                return (
                  <FeatherIcon
                    name="menu"
                    size={BaseSize.headerMenuIconSize}
                    color={BaseColor.redColor}
                  />
                );
              }
            }}
            onPressLeft={() => {
              if (isGuestMode) {
                navigation.goBack();
              } else {
                navigation.openDrawer();
              }
            }}
            style={{backgroundColor: 'white'}}
            statusBarColor={BaseColor.grayBackgroundColor}
          />
          {loaded && (
            <View style={styles.mainContainer}>
              {orders.length === 0 ? (
                <View style={{flex: 1}}>
                  <NoOrdersSvg
                    width={slideSize}
                    height={slideSize}
                    style={{alignSelf: 'center'}}
                  />
                  <View style={{alignItems: 'center'}}>
                    <Text title1>{'У вас еще нет заказов'}</Text>
                    <Text
                      middleBody
                      grayColor
                      style={{
                        padding: 10,
                        textAlign: 'center',
                        lineHeight: 24,
                      }}>
                      {
                        'Найдите магазин поблизости, выберите товары и сделайте заказ'
                      }
                    </Text>
                  </View>
                </View>
              ) : (
                <FlatList
                  data={orders}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) =>
                    this.renderOrderView(item, index)
                  }
                  ItemSeparatorComponent={this.renderSeparator}
                  style={{marginTop: 6}}
                />
              )}
            </View>
          )}
        </SafeAreaView>
        {loaded && orders.length === 0 && (
          <View
            style={{
              backgroundColor: 'white',
            }}>
            <TouchableOpacity
              onPress={this.onReturnBtn}
              style={{
                backgroundColor: BaseColor.redColor,
                marginHorizontal: 45,
                borderRadius: 5,
                alignItems: 'center',
                padding: 11,
                marginBottom: 50,
              }}>
              <Text middleBody whiteColor style={{textAlign: 'center'}}>
                {'Вернуться к выбору продуктов'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </AndroidBackHandler>
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

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
