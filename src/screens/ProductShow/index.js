import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {View, Dimensions, ScrollView, ImageBackground} from 'react-native';
import {bindActionCreators} from 'redux';
import moment from 'moment-timezone';
import {Text, Header, Image, SafeAreaView} from '@components';
import styles from './styles';
import {BaseColor, BaseSize, Images} from '@config';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Minus from '../../assets/svgs/minus.svg';
import Plus from '../../assets/svgs/plus.svg';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {UserServices, GuestServices} from '../../services';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class ProductShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      scrollEnabled: true,
      prevIndex: 0,
      sliderWidth: Dimensions.get('window').width - 80,
      activeSlide: 0,
      originalPrices: 0,
      product: null,
      productID: 0,
      quantity: 0,
      deliveryZone: {},
      cart: null,
    };
  }

  onFocus = () => {
    const {auth} = this.props;
    if (auth.user !== null) {
      this.getCart();
    }
    if (
      auth?.partner &&
      auth?.activeAddress &&
      (auth?.partner?.delivery_zones !== null ||
        auth?.partner?.delivery_zones !== undefined)
    ) {
      if (
        auth.partner.delivery_zones.find(
          (zone) => zone.district === auth.activeAddress.district,
        ) === undefined
      ) {
        if (
          auth.partner.delivery_zones.some(
            (zone) => zone.district === 'Выбрать все районы (Москва)\r\n',
          )
        ) {
          this.setState({
            deliveryZone: auth.partner.delivery_zones.find(
              (zone) => zone.district === 'Выбрать все районы (Москва)\r\n',
            ),
          });
        }
      } else {
        this.setState({
          deliveryZone: auth.partner.delivery_zones.find(
            (zone) => zone.district === auth.activeAddress.district,
          ),
        });
      }
    }
    this.setState({
      productID: this.props.route.params.productID,
      product: auth.products.find(
        (val) => val.id === this.props.route.params.productID,
      ),
    });
  };

  getCart = () => {
    const {auth, actions} = this.props;
    this.setState({loading: true});
    UserServices.getCart(auth.user.access_token)
      .then((response) => {
        if (response.data.success === 1) {
          const cart = response.data.data.cart;
          if (cart === null) {
            actions.saveTotalPrice(0);
          } else {
            var totalPrice = 0;
            this.setState({loading: true});
            GuestServices.getCatalogueById(cart.company_id)
              .then((response) => {
                if (response.data.success === 1) {
                  actions.saveProducts(response.data.data.products);
                  cart.products.forEach((product) => {
                    var itemInfo = undefined;
                    response.data.data.products.forEach((item) => {
                      if (product.productID === item.id) {
                        itemInfo = item;
                      }
                    });

                    var price =
                      itemInfo !== undefined
                        ? itemInfo.hasPromo === 1
                          ? itemInfo.promo.new_price
                          : itemInfo.price
                        : 0;
                    totalPrice = parseFloat(
                      (totalPrice + price * product.quantity).toFixed(2),
                    );
                  });
                } else {
                  console.error(
                    'something went wrong while getting partner by id',
                    response.data.message,
                  );
                }
              })
              .catch((err) => {
                console.error('err in getting partner', err);
              })
              .finally(() => {
                this.setState({loading: false});
                actions.saveTotalPrice(totalPrice);
              });
          }
          this.setState({cart: cart});
        } else {
          console.error(
            'something went wrong while getting cart',
            response.data.message,
          );
        }
      })
      .catch((err) => {
        console.error('err in getting cart 6', err);
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  minutesOfDay = (m) => {
    return m.minutes() + m.hours() * 60;
  };

  checkIsBefore(timeframe) {
    var format = 'HH:mm';
    return (
      this.minutesOfDay(moment()) <
      this.minutesOfDay(moment(timeframe.start, format))
    );
  }

  checkIsBetween(timeframe) {
    var format = 'HH:mm';
    return (
      this.minutesOfDay(moment()) >
        this.minutesOfDay(moment(timeframe.start, format)) &&
      this.minutesOfDay(moment()) <
        this.minutesOfDay(moment(timeframe.end, format))
    );
  }

  getAvailableDeliveryDay(deliveryZone) {
    const {auth} = this.props;
    if (auth.deliveryDay !== null) {
      return auth.deliveryDay;
    }
    var availableTimeframes = [];
    deliveryZone?.delivery_timeframes?.map((timeframe, index) => {
      if (this.checkIsBefore(timeframe) || this.checkIsBetween(timeframe)) {
        availableTimeframes.push(timeframe);
      }
    });
    if (deliveryZone !== undefined && deliveryZone !== null) {
      if (
        JSON.parse(deliveryZone?.days).some((item) => item === 0) &&
        availableTimeframes.length > 0
      ) {
        return 'Сегодня';
      } else if (
        JSON.parse(deliveryZone?.days).some((item) => item === 1) ||
        (JSON.parse(deliveryZone?.days).some((item) => item === 0) &&
          availableTimeframes.length === 0)
      ) {
        return 'Завтра';
      } else if (JSON.parse(deliveryZone?.days).some((item) => item === 2)) {
        return 'Послезавтра';
      }
    }
  }

  _renderItem = ({item, index}) => {
    const {deliveryZone} = this.state;
    return (
      <View style={styles.slide}>
        <ImageBackground
          source={Images.productPlaceholder}
          imageStyle={{borderRadius: 10}}
          style={styles.partnerImgBackground}>
          <Image
            source={{uri: item.image_url}}
            resizeMode="contain"
            style={styles.swiperImg}
          />
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              left: 12,
              bottom: 12,
            }}>
            <View style={styles.partnerDateBadge}>
              <Text style={{fontSize: 13}} whiteColor>
                {this.getAvailableDeliveryDay(deliveryZone)}
              </Text>
            </View>
            {item && item.free_delivery_from !== null && (
              <View style={styles.partnerDescriptionBadge}>
                {deliveryZone && (
                  <Text footnote whiteColor>
                    Бесплатная доставка от {deliveryZone.free_delivery_from} ₽
                  </Text>
                )}
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  getEconomizedPrice() {
    const {auth} = this.props;
    const {product, productID, cart} = this.state;
    let _cart = cart !== null ? cart.products : auth.cart;

    var ecoPrice = 0;
    if (product) {
      var itemInfo = auth.products.find((item) => item.id === product.id);
      let quantity =
        _cart.find((product) => product.productID === productID) === undefined
          ? 0
          : _cart.find((product) => product.productID === productID).quantity;
      if (itemInfo && itemInfo.hasPromo === 1) {
        ecoPrice += (itemInfo.price - itemInfo.promo.new_price) * quantity;
      }
    }
    return parseFloat(ecoPrice.toFixed(2));
  }

  onMinusBtn = () => {
    const {auth, actions} = this.props;
    const {productID, product, cart} = this.state;
    let _cart = cart !== null ? cart.products : auth.cart;
    let tmpCart = _cart;
    let productIndexInCart = _cart.findIndex((x) => x.productID === productID);
    if (productIndexInCart === -1) {
      return;
    } else {
      if (
        // item quantity > 1
        tmpCart[productIndexInCart].quantity !== 1
      ) {
        tmpCart[productIndexInCart].quantity--;
        // actions.minusDiscountPrice(product.price);
        if (product.hasPromo) {
          actions.minusTotalPrice(product.promo.new_price);
        } else {
          actions.minusTotalPrice(product.price);
        }
      } else {
        // item quantity : 1
        tmpCart = tmpCart.filter((val) => val.productID !== productID);
        // actions.minusDiscountPrice(product.price);
        if (product.hasPromo) {
          actions.minusTotalPrice(product.promo.new_price);
        } else {
          actions.minusTotalPrice(product.price);
        }
      }
      if (auth.user) {
        this.addToCart(tmpCart);
      } else {
        actions.setCart(tmpCart);
      }
    }
  };

  onPlusBtn = () => {
    const {auth, actions} = this.props;
    const {productID, cart} = this.state;
    let _cart = cart !== null ? cart.products : auth.cart;
    let tmpCart = _cart;
    let product = auth.products.find((val) => val.id === productID);
    if (product.hasPromo) {
      actions.addTotalPrice(product.promo.new_price);
    } else {
      actions.addTotalPrice(product.price);
    }
    if (_cart.findIndex((x) => x.productID === productID) === -1) {
      tmpCart.push({productID: productID, quantity: 1});
    } else {
      tmpCart[_cart.findIndex((x) => x.productID === productID)].quantity++;
    }
    if (auth.user === null) {
      actions.setCart(tmpCart);
    } else {
      this.addToCart(tmpCart);
    }
  };

  addToCart = (tmpCart) => {
    const {auth, actions, navigation} = this.props;
    const {cart} = this.state;
    if (tmpCart.length === 0) {
      // delete cart
      this.setState({loading: true});
      UserServices.clearCart(auth.user.access_token, cart.id)
        .then((response) => {
          if (response.data.success === 1) {
            this.setState({cart: null});
            UserServices.getCart(auth.user.access_token)
              .then((response1) => {
                if (response1.data.success === 1) {
                  const _cart = response1.data.data.cart;
                  let totalPrice = 0;
                  _cart?.products.forEach((product) => {
                    var itemInfo;
                    auth.products.forEach((item) => {
                      if (product?.productID === item?.id) {
                        itemInfo = item;
                      }
                    });
                    var price =
                      itemInfo !== undefined
                        ? itemInfo?.hasPromo === 1
                          ? itemInfo?.promo?.new_price
                          : itemInfo?.price
                        : 0;
                    totalPrice = parseFloat(
                      (totalPrice + price * product?.quantity).toFixed(2),
                    );
                  });
                  actions.saveTotalPrice(totalPrice);
                  this.setState({cart: cart});
                } else {
                  console.error('error in getting cart', response.data.message);
                  navigation.navigate('ErrorScreen', {
                    message: response.data.message,
                  });
                }
              })
              .catch((err) => {
                console.error('error in getting cart', err);
                navigation.navigate('ErrorScreen', {
                  message: err.message,
                });
              })
              .finally(() => {
                this.setState({loading: false});
              });
          } else {
            console.error('wrong in clearCart', response.data.message);
            navigation.navigate('ErrorScreen', {
              message: response.data.message,
            });
          }
        })
        .catch((err) => {
          console.error('err in clearCart', err);
          navigation.navigate('ErrorScreen', {message: err.message});
        })
        .finally(() => {
          this.setState({loading: false, adding: false});
        });
    } else {
      const body = {
        company_id: auth.partner.id,
        products: tmpCart,
      };
      this.setState({loading: true});
      UserServices.addToCart(auth.user.access_token, body)
        .then((response) => {
          if (response.data.success === 1) {
            this.setState({loading: true});
            UserServices.getCart(auth.user.access_token)
              .then((response) => {
                if (response.data.success === 1) {
                  const cart = response.data.data.cart;
                  this.setState({cart: cart});
                } else {
                  console.error('error in getting cart', response.data.message);
                }
              })
              .catch((err) => {
                console.error('error in getting cart', err);
              })
              .finally(() => {
                this.setState({loading: false});
              });
          } else {
            console.error(
              'something went wrong while adding purchase to cart',
              response.data.message,
            );
          }
        })
        .catch((err) => {
          console.error('1err in adding to cart', err);
        })
        .finally(() => {
          this.setState({loading: false});
        });
    }
  };

  onAddBtn = () => {
    this.props.navigation.navigate('ProductDetail');
  };

  render() {
    const {
      sliderWidth,
      product,
      activeSlide,
      productID,
      loading,
      cart,
    } = this.state;
    const {auth} = this.props;
    var ecoPrice = this.getEconomizedPrice();
    let _cart = cart !== null ? cart.products : auth.cart;
    let quantity =
      _cart.find((product) => product.productID === productID) === undefined
        ? 0
        : _cart.find((product) => product.productID === productID).quantity;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <Spinner visible={loading} color="#FF2D34" />
        <SafeAreaView style={styles.contain} forceInset={{top: 'never'}}>
          <Header
            title={product?.name}
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
              this.props.navigation.goBack();
            }}
            style={{backgroundColor: BaseColor.grayBackgroundColor}}
            statusBarColor={BaseColor.grayBackgroundColor}
          />
          {product && (
            <>
              {/* Carousel */}
              <View>
                <Carousel
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={product.images}
                  renderItem={this._renderItem}
                  sliderWidth={sliderWidth + 80}
                  itemWidth={sliderWidth + 35}
                  onSnapToItem={(index) => this.setState({activeSlide: index})}
                />
              </View>
              <Pagination
                dotsLength={product.images.length}
                activeDotIndex={activeSlide}
                dotStyle={styles.carouselPagination}
                inactiveDotOpacity={0.3}
                inactiveDotScale={1}
                containerStyle={{paddingBottom: 15, paddingHorizontal: 9}}
              />
              {/* product details and description */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={[styles.contain, {marginHorizontal: 20}]}>
                <Text title1 style={{textAlign: 'left', marginBottom: 24}}>
                  {product.name}
                </Text>
                <Text
                  numberOfLines={0}
                  body2
                  grayColor
                  style={{lineHeight: 20}}>
                  {product.description}
                </Text>
              </ScrollView>
              {/* cart total price and minus, plus buttons */}
              <View style={styles.bottomBar}>
                {/* totalPrice */}
                <View style={styles.totalPrice}>
                  {product.hasPromo === 1 && ecoPrice > 0 ? (
                    <>
                      <View style={{alignItems: 'flex-start'}}>
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            color: '#B3B3B3',
                          }}>
                          {ecoPrice} ₽
                        </Text>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text title2>
                          {product.promo.new_price * quantity} ₽
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View style={{alignItems: 'center'}}>
                      <Text title2>{product.price * quantity} ₽</Text>
                    </View>
                  )}
                </View>
                <View style={styles.countBtn}>
                  <View style={styles.countBtnInside}>
                    <TouchableOpacity
                      onPress={() => {
                        this.onMinusBtn();
                      }}>
                      <Minus width={18} height={18} />
                    </TouchableOpacity>
                    <Text title3 bold style={{marginHorizontal: 20}}>
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.onPlusBtn();
                      }}>
                      <Plus width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    styles.addBtn,
                    quantity > 0
                      ? {backgroundColor: BaseColor.redColor}
                      : {backgroundColor: BaseColor.textInputBackgroundColor},
                  ]}>
                  <TouchableOpacity
                    disabled={quantity === 0}
                    onPress={() => {
                      this.onAddBtn();
                    }}>
                    <Text
                      middleBody
                      style={
                        quantity > 0
                          ? {color: BaseColor.whiteColor}
                          : {color: BaseColor.placeholderColor}
                      }>
                      {'Добавить'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductShow);
