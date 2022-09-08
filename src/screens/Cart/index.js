import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {View, Alert, ScrollView, ImageBackground} from 'react-native';
import {bindActionCreators} from 'redux';
import {Text, Header, Image, SafeAreaView} from '@components';
import styles from './styles';
import {BaseColor, BaseSize, Images} from '@config';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Minus from '../../assets/svgs/minus.svg';
import Plus from '../../assets/svgs/plus.svg';
import {useFocusEffect} from '@react-navigation/native';
import {GuestServices, UserServices} from '../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import Badge2 from '../../assets/svgs/badge2.svg';
import moment from 'moment-timezone';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      products: [],
      archivedProducts: [],
      checkedOutOfStock: false,
      delivery_zone: {},
      inactive: false,
      cart: null,
    };
  }

  getCart = () => {
    const {auth, actions} = this.props;
    this.setState({loading: true});
    UserServices.getCart(auth?.user?.access_token)
      .then((response) => {
        if (response.data.success === 1) {
          const cart = response.data.data?.cart;
          if (cart === null) {
            actions.saveTotalPrice(0);
            this.setState({cart: null});
          } else {
            this.setState({cart: cart});
            var totalPrice = 0;
            this.setState({loading: true});
            GuestServices.getCatalogueById(cart?.company_id)
              .then((response) => {
                if (response.data.success === 1) {
                  actions.saveProducts(response.data.data?.products);
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
        } else {
          console.error(
            'something went wrong while getting cart',
            response.data.message,
          );
        }
      })
      .catch((err) => {
        console.error('err in getting cart 1', err);
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  filterBreakTimes = (partner) => {
    let flag = false;
    flag = false;
    if (partner.timeframes[0].break_times.length > 0) {
      partner.timeframes[0].break_times.map((timeframe) => {
        if (this._checkIsBetween(timeframe)) {
          flag = true;
        }
      });
    }
    return flag === false;
  };

  onFocus = () => {
    const {auth} = this.props;
    this.setState({inactive: !this.filterBreakTimes(auth.partner)});
    if (auth.user !== null) {
      this.getCart();
    }
    this.setState({loading: false});
    if (
      auth?.partner?.delivery_zones.some(
        (zone) => zone?.district === auth?.activeAddress?.district,
      )
    ) {
      this.setState({
        delivery_zone: auth?.partner?.delivery_zones.find(
          (zone) => zone?.district === auth?.activeAddress?.district,
        ),
      });
    } else {
      this.setState({
        delivery_zone: auth.partner.delivery_zones.find(
          (zone) => zone.district === 'Выбрать все районы (Москва)\r\n',
        ),
      });
    }
  };

  onMinusBtn = (productID) => {
    const {auth, actions, navigation} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;
    // let tmpCart = cart.products;
    let tmpCart = _cart;
    let product = auth.products.find((val) => val.id === productID);
    if (
      // item quantity > 1
      tmpCart[_cart.findIndex((x) => x.productID === productID)].quantity !== 1
    ) {
      tmpCart[_cart.findIndex((x) => x.productID === productID)].quantity--;
      if (product.hasPromo) {
        actions.minusTotalPrice(product.promo.new_price);
      } else {
        actions.minusTotalPrice(product.price);
      }
    } else {
      // item quantity : 1
      tmpCart = tmpCart.filter((val) => val.productID !== productID);
      if (product.hasPromo) {
        actions.minusTotalPrice(product.promo.new_price);
      } else {
        actions.minusTotalPrice(product.price);
      }
    }
    if (tmpCart.length === 0) {
      navigation.navigate('Catalogue');
    }
    if (auth.user === null) {
      actions.setCart(tmpCart);
    } else {
      this.addToCart(tmpCart);
    }
  };

  onPlusBtn = (productID) => {
    const {auth, actions} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;

    // let tmpCart = cart.products;
    let tmpCart = _cart;
    let product = auth.products.find((val) => val.id === productID);
    if (product.hasPromo) {
      actions.addTotalPrice(product.promo.new_price);
    } else {
      actions.addTotalPrice(product.price);
    }
    tmpCart[_cart.findIndex((x) => x.productID === productID)].quantity++;
    if (auth.user === null) {
      actions.setCart(tmpCart);
    } else {
      this.addToCart(tmpCart);
    }
  };

  checkMinimalCheckout = () => {
    const {auth} = this.props;
    const {delivery_zone} = this.state;
    if (auth.partner !== null) {
      return auth.totalPrice < delivery_zone?.min_order_price;
    } else {
      return true;
    }
  };

  clearCart = () => {
    const {auth, actions, navigation} = this.props;
    const {cart} = this.state;
    // clear cart
    this.setState({loading: true});
    if (auth.user === null) {
      actions.clearCart();
      actions.clearDeliveryDay();
      actions.clearTotalPrice();
      actions.clearDiscountPrice();
      actions.clearPartner();
      this.setState({loading: false});
      navigation.navigate('Catalogue');
    } else {
      UserServices.clearCart(auth.user.access_token, cart.id)
        .then((response) => {
          if (response.data.success === 1) {
            actions.clearCart();
            actions.clearDeliveryDay();
            actions.clearTotalPrice();
            actions.clearDiscountPrice();
            // actions.clearPartner();
            navigation.navigate('Catalogue');
          } else {
            console.error(
              'something went wrong while clearing cart',
              response.data.message,
            );
            navigation.navigate('ErrorScreen', {
              message: response.data.message,
            });
          }
        })
        .catch((err) => {
          console.error('err in clearing cart_1', err);
          navigation.navigate('ErrorScreen', {message: err.message});
        })
        .finally(() => {
          this.setState({loading: false});
        });
    }
  };

  getEconomizedPrice() {
    const {auth} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;

    var ecoPrice = 0;
    _cart.forEach((item) => {
      var itemInfo = auth.products.find(
        (product) => product.id === item.productID,
      );
      if (itemInfo && itemInfo.hasPromo === 1) {
        ecoPrice += (itemInfo.price - itemInfo.promo.new_price) * item.quantity;
      }
    });
    return parseFloat(ecoPrice.toFixed(2));
  }

  minutesOfDay = (m) => {
    return m.minutes() + m.hours() * 60;
  };

  checkIsBetween = () => {
    const {auth, navigation} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;
    var updated_partner;
    if (auth.user === null) {
      // guest mode

      if (auth.activeAddress.district !== null) {
        this.setState({loading: true});
        GuestServices.getAllPartners(undefined, auth.activeAddress.district)
          .then((response) => {
            if (response.data.success === 1) {
              this.setState({loading: false});

              updated_partner = response.data.data.data.find(
                (partner) => partner.id === auth.partner.id,
              );
              if (updated_partner === undefined) {
                console.error('err in getCatalogues: partner not found');
                Alert.alert(
                  'Этот партнер в данный момент недоступен.\nПожалуйста, повторите попытку позже.',
                );

                this.setState({inactive: true});
              } else {
                var start = updated_partner.working_starts_at;
                var end = updated_partner.working_ends_at;
                if (end === '24:00:00') {
                  end = '23:59:59';
                }

                var format = 'HH:mm';
                this.setState(
                  {
                    inactive: !(
                      this.minutesOfDay(moment()) >
                        this.minutesOfDay(moment(start, format)) &&
                      this.minutesOfDay(moment()) <
                        this.minutesOfDay(moment(end, format))
                    ),
                  },
                  () => {
                    if (this.state.inactive === false) {
                      const {navigation, auth, actions} = this.props;
                      const {archivedProducts, checkedOutOfStock} = this.state;

                      if (checkedOutOfStock) {
                        Alert.alert(
                          'Некоторых товаров нет в наличии',
                          'Продолжить без них, или вернуться в магазин и посмотреть другие товары?',
                          [
                            {
                              text: 'Вернуться в магазин',
                              onPress: () => {
                                navigation.goBack();
                              },
                              style: 'cancel',
                            },
                            {
                              text: 'Продолжить',
                              onPress: () => {
                                // remove archived products from cart
                                archivedProducts.map((productID, index) => {
                                  let cartProducts = _cart;
                                  if (
                                    auth.products.find(
                                      (val) => val.id === productID,
                                    ).hasPromo
                                  ) {
                                    // actions.minusTotalPrice(
                                    //   auth.products.find(
                                    //     (val) => val.id === productID,
                                    //   ).promo.new_price *
                                    //     cart.products.find(
                                    //       (product) =>
                                    //         product.productID === productID,
                                    //     ).quantity,
                                    // );
                                    actions.minusTotalPrice(
                                      auth.products.find(
                                        (val) => val.id === productID,
                                      ).promo.new_price *
                                        _cart.find(
                                          (product) =>
                                            product.productID === productID,
                                        ).quantity,
                                    );
                                  } else {
                                    // actions.minusTotalPrice(
                                    //   auth.products.find(
                                    //     (val) => val.id === productID,
                                    //   ).price *
                                    //     cart.products.find(
                                    //       (product) =>
                                    //         product.productID === productID,
                                    //     ).quantity,
                                    // );
                                    actions.minusTotalPrice(
                                      auth.products.find(
                                        (val) => val.id === productID,
                                      ).price *
                                        _cart.find(
                                          (product) =>
                                            product.productID === productID,
                                        ).quantity,
                                    );
                                  }
                                  if (auth.user === null) {
                                    actions.setCart(
                                      cartProducts.filter(
                                        (item) => item.productID !== productID,
                                      ),
                                    );
                                  } else {
                                    this.addToCart(
                                      cartProducts.filter(
                                        (item) => item.productID !== productID,
                                      ),
                                    );
                                  }
                                });
                                if (this.checkMinimalCheckout()) {
                                  this.setState({
                                    checkedOutOfStock: false,
                                    archivedProducts: [],
                                  });
                                  navigation.navigate('Payment', {
                                    cart: cart !== null ? cart : auth.cart,
                                  });
                                }
                              },
                            },
                          ],
                        );
                      } else {
                        this.setState({loading: true});
                        GuestServices.getCatalogueById(auth.partner.id)
                          .then((response) => {
                            if (response.data.success === 1) {
                              const partnerProducts =
                                response.data.data.products;
                              let archivedProducts = this.state
                                .archivedProducts;
                              // cart.products.map((product, index) => {
                              //   var foundProduct = partnerProducts.find(
                              //     (item) => item.id === product.productID,
                              //   );
                              //   if (foundProduct === undefined) {
                              //     Alert.alert('Этот товар больше недоступен');
                              //   } else {
                              //     if (foundProduct.archived === 1) {
                              //       archivedProducts.push(product.productID);
                              //       this.setState({
                              //         archivedProducts: archivedProducts,
                              //       });
                              //     }
                              //   }
                              // });
                              _cart.map((product, index) => {
                                var foundProduct = partnerProducts.find(
                                  (item) => item.id === product.productID,
                                );
                                if (foundProduct === undefined) {
                                  Alert.alert('Этот товар больше недоступен');
                                } else {
                                  if (foundProduct.archived === 1) {
                                    archivedProducts.push(product.productID);
                                    this.setState({
                                      archivedProducts: archivedProducts,
                                    });
                                  }
                                }
                              });
                              if (archivedProducts.length === 0) {
                                this.setState({
                                  checkedOutOfStock: false,
                                  archivedProducts: [],
                                });
                                navigation.navigate('Payment', {
                                  cart:
                                    this.state.cart !== null ? cart : auth.cart,
                                });
                              } else {
                                // minus archived products from cart.
                                this.setState({checkedOutOfStock: true});
                              }
                            } else {
                              console.error(
                                'sth went wrong while getting partner products by id',
                                response.data.message,
                              );
                              navigation.navigate('ErrorScreen', {
                                message: response.data.message,
                              });
                            }
                          })
                          .catch((err) => {
                            console.error('err in getting partner by id', err);
                            navigation.navigate('ErrorScreen', {
                              message: err.message,
                            });
                          })
                          .finally(() => {
                            this.setState({loading: false});
                          });
                      }
                    }
                  },
                );
              }
            } else {
              console.error(
                'sth wrong : getAllPartners',
                response.data.message,
              );
            }
          })
          .catch((err) => {
            console.error('err : getAllPartners', err);
          })
          .finally(() => {
            this.setState({loading: false});
          });
      }
    } else {
      this.setState({loading: true});
      GuestServices.getCatalogues(auth.user.access_token)
        .then((response) => {
          if (response.data.success === 1) {
            this.setState({loading: false});

            updated_partner = response.data.data.data.find(
              (partner) => partner.id === auth.partner.id,
            );
            if (updated_partner === undefined) {
              console.error('err in getCatalogues: partner not found');
              Alert.alert(
                'Этот партнер в данный момент недоступен.\nПожалуйста, повторите попытку позже.',
              );
              this.setState({inactive: true});
            } else {
              var start = updated_partner.working_starts_at;
              var end = updated_partner.working_ends_at;
              if (end === '24:00:00') {
                end = '23:59:59';
              }

              var format = 'HH:mm';
              var isBetween =
                this.minutesOfDay(moment()) >
                  this.minutesOfDay(moment(start, format)) &&
                this.minutesOfDay(moment()) <
                  this.minutesOfDay(moment(end, format));
              this.setState(
                {
                  inactive: !isBetween,
                },
                () => {
                  if (this.state.inactive === false) {
                    const {navigation, auth, actions} = this.props;
                    const {archivedProducts, checkedOutOfStock} = this.state;

                    if (checkedOutOfStock) {
                      Alert.alert(
                        'Некоторых товаров нет в наличии',
                        'Продолжить без них, или вернуться в магазин и посмотреть другие товары?',
                        [
                          {
                            text: 'Вернуться в магазин',
                            onPress: () => {
                              navigation.goBack();
                            },
                            style: 'cancel',
                          },
                          {
                            text: 'Продолжить',
                            onPress: () => {
                              // remove archived products from cart
                              archivedProducts.map((productID, index) => {
                                let cartProducts = cart;
                                if (
                                  auth.products.find(
                                    (val) => val.id === productID,
                                  ).hasPromo
                                ) {
                                  actions.minusTotalPrice(
                                    auth.products.find(
                                      (val) => val.id === productID,
                                    ).promo.new_price *
                                      _cart.find(
                                        (product) =>
                                          product.productID === productID,
                                      ).quantity,
                                  );
                                } else {
                                  actions.minusTotalPrice(
                                    auth.products.find(
                                      (val) => val.id === productID,
                                    ).price *
                                      _cart.find(
                                        (product) =>
                                          product.productID === productID,
                                      ).quantity,
                                  );
                                }
                                if (auth.user === null) {
                                  actions.setCart(
                                    cartProducts.filter(
                                      (item) => item.productID !== productID,
                                    ),
                                  );
                                } else {
                                  this.addToCart(
                                    cartProducts.filter(
                                      (item) => item.productID !== productID,
                                    ),
                                  );
                                }
                              });
                              if (this.checkMinimalCheckout()) {
                                this.setState({
                                  checkedOutOfStock: false,
                                  archivedProducts: [],
                                });
                                navigation.navigate('Payment', {
                                  cart:
                                    this.state.cart !== null ? cart : auth.cart,
                                });
                              }
                            },
                          },
                        ],
                      );
                    } else {
                      this.setState({loading: true});
                      GuestServices.getCatalogueById(auth.partner.id)
                        .then((response) => {
                          if (response.data.success === 1) {
                            const partnerProducts = response.data.data.products;
                            let archivedProducts = this.state.archivedProducts;
                            _cart.map((product, index) => {
                              var foundProduct = partnerProducts.find(
                                (item) => item.id === product.productID,
                              );
                              if (foundProduct === undefined) {
                                Alert.alert('Этот товар больше недоступен');
                              } else {
                                if (foundProduct.archived === 1) {
                                  archivedProducts.push(product.productID);
                                  this.setState({
                                    archivedProducts: archivedProducts,
                                  });
                                }
                              }
                            });
                            if (archivedProducts.length === 0) {
                              this.setState({
                                checkedOutOfStock: false,
                                archivedProducts: [],
                              });
                              navigation.navigate('Payment', {
                                cart:
                                  this.state.cart !== null ? cart : auth.cart,
                              });
                            } else {
                              // minus archived products from cart.
                              this.setState({checkedOutOfStock: true});
                            }
                          } else {
                            console.error(
                              'sth went wrong while getting partner products by id',
                              response.data.message,
                            );
                            navigation.navigate('ErrorScreen', {
                              message: response.data.message,
                            });
                          }
                        })
                        .catch((err) => {
                          console.error('err in getting partner by id', err);
                          navigation.navigate('ErrorScreen', {
                            message: err.message,
                          });
                        })
                        .finally(() => {
                          this.setState({loading: false});
                        });
                    }
                  }
                },
              );
            }
          } else {
            console.error('err in getCatalogues 2', response.data.message);
            navigation.navigate('ErrorScreen', {
              message: response.data.message,
            });
          }
        })
        .catch((err) => {
          console.error('err in getCatalogues 1', err);
          navigation.navigate('ErrorScreen', {
            message: err.message,
          });
        })
        .finally(() => {
          this.setState({loading: false});
        });
    }
  };

  _checkIsBetween(timeframe) {
    var format = 'HH:mm';
    return (
      this.minutesOfDay(moment()) >
        this.minutesOfDay(moment(timeframe.start, format)) &&
      this.minutesOfDay(moment()) <
        this.minutesOfDay(moment(timeframe.end, format))
    );
  }

  addToCart = (tmpCart) => {
    const {auth} = this.props;

    const body = {
      company_id: auth.partner.id,
      products: tmpCart,
    };
    if (tmpCart.length === 0) {
      this.clearCart();
      return;
    }
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
        console.error('err in adding to cart', err);
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  onNextBtn = () => {
    this.checkIsBetween();
  };

  renderProductsView(item) {
    const {auth} = this.props;
    const {archivedProducts, inactive, cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;
    const product = auth.products.find((val) => val.id === item.productID);
    const isOutOfStock = archivedProducts.includes(item.productID);
    return (
      <View
        style={[
          styles.productRow,
          {
            backgroundColor: isOutOfStock || inactive ? '#F9F9F9' : 'white',
          },
        ]}
        keyExtractor={(item, index) => index.toString()}>
        {/* {cart !== null && cart.products.length > 0 && ( */}
        {product !== undefined && _cart !== null && _cart.length > 0 && (
          <>
            <View style={{flex: 2}}>
              <ImageBackground
                source={Images.productPlaceholder}
                imageStyle={{borderRadius: 10}}
                style={styles.partnerImgBackground}>
                <Image
                  source={{
                    uri: product.images[0].image_url,
                  }}
                  style={styles.productImg}
                />
                {product.hasPromo === 1 && (
                  <Badge2
                    width={20}
                    height={20}
                    style={{position: 'absolute', top: 5, right: 5}}
                  />
                )}
              </ImageBackground>
            </View>
            <View style={{flex: 8, padding: 5}}>
              <View style={styles.productInfo}>
                <View style={{flex: 12}}>
                  <Text
                    middleBody
                    numberOfLines={2}
                    style={{
                      color: isOutOfStock || inactive ? '#B5B5B5' : 'black',
                    }}>
                    {product.name}
                  </Text>
                </View>
                <View style={{flex: 4, alignItems: 'flex-end'}}>
                  <Text
                    bold
                    body2
                    style={{
                      color: isOutOfStock || inactive ? '#B5B5B5' : 'black',
                    }}>
                    {/* {(product.hasPromo
                      ? product.promo.new_price
                      : product.price) *
                      cart.products.find(
                        (val) => val.productID === item.productID,
                      ).quantity} */}
                    {parseFloat(
                      (
                        (product.hasPromo
                          ? product.promo.new_price
                          : product.price) *
                        _cart.find((val) => val.productID === item.productID)
                          .quantity
                      ).toFixed(2),
                    )}
                    {' ₽'}
                  </Text>
                </View>
              </View>
              <View>
                {isOutOfStock ? (
                  <View style={styles.outOfStockLabel}>
                    <Text footnote style={{color: '#898989'}}>
                      {'Уже раскупили'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.countBtn}>
                    <View style={styles.countBtnInside}>
                      <TouchableOpacity
                        disabled={isOutOfStock || inactive}
                        onPress={() => {
                          this.onMinusBtn(item.productID);
                        }}>
                        <Minus width={18} height={18} />
                      </TouchableOpacity>
                      <Text title3 style={{marginHorizontal: 30}}>
                        {/* {
                          cart.products.find(
                            (val) => val.productID === item.productID,
                          ).quantity
                        } */}
                        {
                          _cart.find((val) => val.productID === item.productID)
                            .quantity
                        }
                      </Text>
                      <TouchableOpacity
                        disabled={isOutOfStock || inactive}
                        onPress={() => {
                          this.onPlusBtn(item.productID);
                        }}>
                        <Plus width={18} height={18} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </View>
    );
  }

  clearCartAlert = () => {
    Alert.alert(
      'Очистить корзину?',
      'Вы уверены, что хотите очистить корзину?',
      [
        {
          text: 'Нет',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Да',
          onPress: () => {
            this.clearCart();
          },
        },
      ],
    );
  };

  checkIsBefore(timeframe) {
    var format = 'HH:mm';
    return (
      this.minutesOfDay(moment()) <
      this.minutesOfDay(moment(timeframe.start, format))
    );
  }

  getAvailableDeliveryDay() {
    const {auth} = this.props;
    if (auth.deliveryDay !== null) {
      return auth.deliveryDay;
    }
    var deliveryZone = {};
    if (
      auth?.activeAddress &&
      auth?.partner &&
      (auth?.partner?.delivery_zones !== null ||
        auth?.partner?.delivery_zones !== undefined)
    ) {
      if (
        auth.partner.delivery_zones !== null &&
        auth.activeAddress.district !== null &&
        auth.partner.delivery_zones.find(
          (zone) => zone.district === auth.activeAddress.district,
        ) !== undefined
      ) {
        deliveryZone = auth.partner.delivery_zones.find(
          (zone) => zone.district === auth.activeAddress.district,
        );
      } else {
        deliveryZone = auth.partner.delivery_zones.find(
          (zone) => zone.district === 'Выбрать все районы (Москва)\r\n',
        );
      }
      var availableTimeframes = [];
      deliveryZone?.delivery_timeframes?.map((timeframe, index) => {
        if (this.checkIsBefore(timeframe) || this._checkIsBetween(timeframe)) {
          availableTimeframes.push(timeframe);
        }
      });
      if (deliveryZone !== null && deliveryZone !== undefined) {
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
    } else {
      return 'Сегодня';
    }
  }

  render() {
    const {loading, delivery_zone, inactive, cart} = this.state;
    const {auth, navigation} = this.props;
    const _cart = cart !== null ? cart.products : auth.cart;
    var ecoPrice = 0;
    if (_cart !== null) this.getEconomizedPrice();
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <Spinner visible={loading} color="#FF2D34" />
        <SafeAreaView
          style={[
            styles.contain,
            this.checkMinimalCheckout() && {
              marginBottomWidth: 1,
              marginBottomColor: BaseColor.textPrimaryColor,
            },
          ]}
          forceInset={{top: 'never'}}>
          <Header
            title="Корзина"
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
              this.setState({inactive: false});
              navigation.goBack();
            }}
            renderRight={() => {
              return (
                <FeatherIcon
                  name="trash-2"
                  size={BaseSize.headerIconSize}
                  color={BaseColor.redColor}
                />
              );
            }}
            onPressRight={() => {
              this.clearCartAlert();
            }}
            style={{backgroundColor: BaseColor.grayBackgroundColor}}
            statusBarColor={BaseColor.grayBackgroundColor}
          />
          <ScrollView
            style={styles.contain}
            showsVerticalScrollIndicator={false}>
            {/* products list */}
            {_cart !== null && _cart.length !== 0 && (
              <View style={{marginHorizontal: 12}}>
                {_cart.map((item, index) => {
                  return this.renderProductsView(item);
                })}
              </View>
            )}
            {/* delivery price */}
            <View style={styles.deliveryInfo}>
              <View style={{flex: 7}}>
                <Text body1 blackColor>
                  {'Доставит курьер партнера'}
                </Text>
              </View>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Text body1 bold>
                  {auth.partner !== null &&
                  delivery_zone &&
                  delivery_zone?.free_delivery_from > auth.totalPrice
                    ? delivery_zone?.delivery_price + ' ₽'
                    : 'Бесплатно'}
                </Text>
              </View>
            </View>
          </ScrollView>
          {/* Minimal Order Price */}
          {auth.partner !== null && this.checkMinimalCheckout() && (
            <View style={styles.minimalWarning}>
              <Text style={styles.minimalCheckoutText}>
                {'Минимальная сумма заказа ' +
                  delivery_zone?.min_order_price +
                  ' руб.'}
              </Text>
            </View>
          )}
          {/* bottomBar */}
          {auth.totalPrice > 0 && (
            <View style={styles.bottomBar}>
              <View style={styles.totalPrice}>
                {ecoPrice > 0 ? (
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
                    <Text title2>
                      {auth.totalPrice +
                        (delivery_zone &&
                          delivery_zone?.free_delivery_from > auth.totalPrice &&
                          delivery_zone?.delivery_price)}{' '}
                      ₽
                    </Text>
                  </>
                ) : (
                  <View style={{alignItems: 'flex-start'}}>
                    <Text title2 semiBold>
                      {auth.totalPrice +
                        (delivery_zone &&
                          delivery_zone?.free_delivery_from > auth.totalPrice &&
                          delivery_zone?.delivery_price)}{' '}
                      ₽
                    </Text>
                    <Text>{this.getAvailableDeliveryDay()}</Text>
                  </View>
                )}
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  disabled={this.checkMinimalCheckout() || this.state.inactive}
                  onPress={this.onNextBtn}
                  style={{
                    borderRadius: 5,
                    // height: 44,
                    paddingVertical: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      this.checkMinimalCheckout() || this.state.inactive
                        ? '#F1F1F1'
                        : BaseColor.redColor,
                    marginRight: 10,
                  }}>
                  <Text
                    middleBody
                    semiBold
                    style={{
                      color: !this.checkMinimalCheckout() ? 'white' : '#B3B3B3',
                    }}>
                    {'Далее'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
