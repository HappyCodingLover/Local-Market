import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {
  View,
  ScrollView,
  Animated,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {Text, Image, Header, SafeAreaView} from '@components';
import styles from './styles';
import {BaseColor, BaseSize, Images} from '@config';
import * as Utils from '@utils';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Badge1 from '../../assets/svgs/badge1.svg';
import Badge2 from '../../assets/svgs/badge2.svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import Minus from '../../assets/svgs/minus.svg';
import Plus from '../../assets/svgs/plus.svg';
import {useFocusEffect} from '@react-navigation/native';
import {GuestServices, UserServices} from '../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import AutoHeightWebView from 'react-native-autoheight-webview';
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

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      products: [],
      count: 0,
      delivery_zone: {},
      subCats: [],
      availableTimeframes: [],
      cart: null,
      adding: false,
      delivery_day: '',
    };
    this._deltaY = new Animated.Value(0);
  }

  getCart = () => {
    const {auth, actions, navigation} = this.props;
    const {params} = this.props.route;
    this.setState({loading: true});
    UserServices.getCart(auth?.user?.access_token)
      .then((response) => {
        if (response.data.success === 1) {
          const cart = response.data?.data?.cart;
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
                  actions.saveProducts(response.data?.data?.products);
                  cart?.products.forEach((product) => {
                    var itemInfo = undefined;
                    response.data?.data?.products.forEach((item) => {
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
                } else {
                  console.error(
                    'something went wrong while getting partner by id',
                    response.data.message,
                  );
                  navigation.navigate('ErrorScreen', {
                    message: response.data.message,
                  });
                }
              })
              .catch((err) => {
                console.error('err in getting partner', err);
                navigation.navigate('ErrorScreen', {
                  message: err.message,
                });
              })
              .finally(() => {
                this.setState({loading: false});
                this.props.actions.saveTotalPrice(totalPrice);
              });
          }
          if (params?.from === 'ProductShow') {
            if (
              cart !== null &&
              cart?.products.findIndex(
                (val) => val?.productID === params?.productID,
              ) === -1
            ) {
              cart = [
                ...cart,
                {productID: params?.productID, quantity: params?.quantity},
              ];
            } else if (cart !== null && cart !== undefined) {
              cart.products[
                cart.products.findIndex(
                  (val) => val.productID === params?.productID,
                )
              ].quantity = params?.quantity;
            }
            this.setState({cart: cart});

            const body = {
              company_id: auth?.partner.id,
              products: cart,
            };

            this.setState({loading: true});
            UserServices.addToCart(auth.user.access_token, body)
              .then((response) => {
                if (response.data.success === 1) {
                  let tmpTotalPrice = 0;
                  cart.map((item, index) => {
                    tmpTotalPrice +=
                      item.quantity *
                      auth.products.find((val) => val.id === item.productID)
                        ?.price;
                  });
                  actions.saveTotalPrice(tmpTotalPrice);
                  actions.saveDiscountPrice(tmpTotalPrice);
                } else {
                  console.error(
                    'error in adding to cart',
                    response.data.message,
                  );
                  navigation.navigate('ErrorScreen', {
                    message: response.data.message,
                  });
                }
              })
              .catch((err) => {
                console.error('error in adding to cart', err);
                navigation.navigate('ErrorScreen', {
                  message: err.message,
                });
              })
              .finally(() => {
                this.setState({loading: false});
              });
          } else {
          }
        } else {
          console.error(
            'something went wrong while getting cart',
            response.data.message,
          );
          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err in getting cart 5', err);
        navigation.navigate('ErrorScreen', {
          message: err.message,
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  onFocus = () => {
    const {auth, actions, navigation} = this.props;
    var temp = [];
    auth?.subCategories.map((ele, index) => {
      temp.push(false);
    });
    this.setState({subCats: temp});
    if (auth.activeAddress !== undefined) {
      if (
        auth.partner?.delivery_zones !== null &&
        auth.partner?.delivery_zones.find(
          (zone) => zone?.district === auth.activeAddress?.district,
        ) !== undefined
      ) {
        this.setState({
          delivery_zone: auth.partner?.delivery_zones.find(
            (zone) => zone?.district === auth.activeAddress?.district,
          ),
        });
      } else {
        this.setState({
          delivery_zone: auth.partner?.delivery_zones.find(
            (zone) => zone?.district === 'Выбрать все районы (Москва)\r\n',
          ),
        });
      }
    }
    var availableTimeframes = [];
    if (auth.partner?.delivery_zones !== null) {
      auth.partner?.delivery_zones
        .find((zone) => zone?.district === auth.activeAddress?.district)
        ?.delivery_timeframes?.map((timeframe, index) => {
          if (this.checkIsBefore(timeframe?.start)) {
            availableTimeframes.push(timeframe);
          }
        });
    }
    availableTimeframes?.sort((left, right) => {
      return (
        moment.utc(moment(left?.start, 'HH:mm')) -
        moment.utc(moment(right?.start, 'HH:mm'))
      );
    });
    this.setState({availableTimeframes: availableTimeframes});

    this.setState({loading: true});
    GuestServices.getProducts(auth.partner.id)
      .then((response) => {
        if (response.data.success === 1) {
          actions.saveProducts(response.data?.data?.products);
          var subCats = response.data?.data?.subcategories;
          subCats.sort(function (a, b) {
            return ('' + a.name).localeCompare(b.name);
          });
          actions.saveSubCategories(subCats);
        } else {
          console.error(
            'something went wrong while fetching products',
            reponse.data.message,
          );
          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err in fetching products', err.message);
        navigation.navigate('ErrorScreen', {
          message: err.message,
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
    if (auth.user !== null) {
      this.getCart();
    }
  };

  getEconomizedPrice() {
    const {auth} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;
    var ecoPrice = 0;
    if (_cart !== undefined && _cart !== null) {
      _cart.forEach((item) => {
        var itemInfo = auth.products.find(
          (product) => product.id === item.productID,
        );
        if (itemInfo && itemInfo.hasPromo === 1) {
          ecoPrice +=
            (itemInfo.price - itemInfo.promo.new_price) * item.quantity;
        }
      });
    }

    return parseFloat(ecoPrice.toFixed(2));
  }

  onSelectType = (type, index) => {
    const {subCats} = this.state;
    var tempSubCats = subCats;
    tempSubCats[index] = !tempSubCats[index];
    this.setState({subCats: tempSubCats});
  };

  addToCart = (tmpCart) => {
    const {auth, actions, navigation} = this.props;
    const {cart} = this.state;
    // return;
    if (tmpCart.length === 0) {
      // delete cart
      this.setState({loading: true});
      UserServices.clearCart(auth.user.access_token, cart.id)
        .then((response) => {
          if (response.data.success === 1) {
            this.setState({cart: null});
            UserServices.getCart(auth.user.access_token)
              .then((response) => {
                if (response.data.success === 1) {
                  const cart = response.data.data.cart;
                  let totalPrice = 0;
                  cart?.products.forEach((product) => {
                    var itemInfo = undefined;
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
                  let totalPrice = 0;
                  cart?.products.forEach((product) => {
                    var itemInfo = undefined;
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
          console.error('__err in adding to cart', err);
        })
        .finally(() => {
          this.setState({loading: false, adding: false});
        });
    }
  };

  onSelectProduct = (product) => {
    this.setState({loading: true, adding: true}, async () => {
      const {auth, actions} = this.props;

      let purchase = {productID: product.id, quantity: 1};
      // actions.addToCart(purchase);
      const cart = this.state.cart;
      if (cart === null) {
      }
      if (auth.user === null) {
        if (product.hasPromo) {
          await actions.addTotalPrice(product.promo.new_price);
        } else {
          await actions.addTotalPrice(product.price);
        }
        await actions.addToCart(purchase);
        this.setState({cart: null, adding: false, loading: false});
      } else {
        this.addToCart(
          cart === null ? [purchase] : [...cart.products, purchase],
        );
      }
    });
  };

  onDateBadge = () => {
    const {auth} = this.props;
    if (auth.partner?.delivery_zones.length !== 0) {
      this.DateSheet.open();
    }
  };

  onCostBadge = () => {
    const {auth} = this.props;
    if (auth.partner?.delivery_zones.length !== 0) {
      this.CostSheet.open();
    }
  };

  onPromoBadge = () => {
    this.PromoSheet.open();
  };

  onSupplierBadge = () => {
    this.SupplierSheet.open();
  };

  onMinusBtn = (productID) => {
    const {auth, actions} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;
    let tmpCart = _cart;
    if (
      _cart &&
      _cart.find((val) => val.productID === productID).quantity !== 0
    ) {
      tmpCart[_cart.findIndex((x) => x.productID === productID)].quantity--;

      tmpCart = tmpCart.filter((item) => item.quantity > 0);
    }
    if (auth.user === null) {
      let product = auth.products.find((val) => val.id === productID);
      if (product.hasPromo) {
        actions.minusTotalPrice(product.promo.new_price);
      } else {
        actions.minusTotalPrice(product.price);
      }
      actions.setCart(tmpCart);
    } else {
      this.addToCart(tmpCart);
    }
  };

  onPlusBtn = (productID) => {
    const {auth, actions} = this.props;
    const {cart} = this.state;
    const _cart = cart !== null ? cart.products : auth.cart;
    let tmpCart = _cart;
    let product = auth.products.find((val) => val.id === productID);

    // if (cart !== null)
    //   tmpCart[cart.products.findIndex((x) => x.productID === productID)]
    //     .quantity++;
    if (_cart !== null) {
      tmpCart[_cart.findIndex((x) => x.productID === productID)].quantity++;
    }
    // actions.setCart(tmpCart);
    if (auth.user === null) {
      if (product.hasPromo) {
        actions.addTotalPrice(product.promo.new_price);
      } else {
        actions.addTotalPrice(product.price);
      }
      actions.setCart(tmpCart);
    } else {
      this.addToCart(tmpCart);
    }
  };

  checkMinimalCheckout = () => {
    const {auth} = this.props;
    const {delivery_zone} = this.state;
    if (auth.partner !== null) {
      return auth.totalPrice < delivery_zone.min_order_price;
    } else {
      return true;
    }
  };

  renderTypesView = (item, index) => {
    const {subCats} = this.state;
    return (
      <TouchableHighlight
        onPress={() => this.onSelectType(item, index)}
        style={[
          styles.typesView,
          subCats[index] && {
            backgroundColor: BaseColor.textPrimaryColor,
          },
        ]}>
        <Text
          footnote
          style={{
            color: subCats[index] ? 'white' : BaseColor.textPrimaryColor,
          }}>
          {item.name}
        </Text>
      </TouchableHighlight>
    );
  };

  renderAllProductsView = (ind) => {
    const {auth} = this.props;
    const {cart, adding} = this.state;
    const _cart =
      cart !== null ? cart.products : auth.totalPrice === 0 ? [] : auth.cart;
    var products = auth.products.filter(
      (val) =>
        val.subcategory_id === auth.subCategories[ind].id && val.archived === 0,
    );
    return (
      <View>
        {products.length > 0 && (
          <Text title2 style={{marginBottom: 10}}>
            {auth.subCategories[ind].name}
          </Text>
        )}
        {/* products list by category */}
        <FlatList
          columnWrapperStyle={{marginBottom: 10}}
          numColumns={2}
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View
              style={[styles.productsView, index % 2 ? {marginLeft: 10} : {}]}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ProductShow', {
                    productID: item.id,
                    quantity:
                      _cart &&
                      _cart.find((val) => val.productID === item.id) ===
                        undefined
                        ? 0
                        : _cart.find((val) => val.productID === item.id)
                            .quantity,
                  });
                }}>
                {item.hasPromo === 1 && (
                  <Badge2
                    width={35}
                    height={35}
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      zIndex: 2,
                    }}
                  />
                )}
                <ImageBackground
                  source={Images.productPlaceholder}
                  imageStyle={{resizeMode: 'cover'}}
                  style={styles.productImg}>
                  <Image
                    source={
                      item.images[0].image_url
                        ? {uri: item.images[0].image_url}
                        : Images.productPlaceholder
                    }
                    resizeMode="cover"
                    style={[styles.productImg, {zIndex: 1}]}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <Text body1 style={{marginVertical: 12}}>
                {item.name}
              </Text>
              {_cart &&
              _cart.find((x) => x.productID === item.id) !== undefined &&
              _cart.find((x) => x.productID === item.id).quantity !== 0 ? (
                <View style={styles.countBtn}>
                  <View style={styles.countBtnInside}>
                    <TouchableOpacity
                      onPress={() => {
                        this.onMinusBtn(item.id);
                      }}>
                      <Minus width={18} height={18} />
                    </TouchableOpacity>
                    <Text title3 bold style={{marginHorizontal: 20}}>
                      {_cart &&
                        _cart.find((x) => x.productID === item.id).quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.onPlusBtn(item.id);
                      }}>
                      <Plus width={18} height={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  {item.hasPromo !== 0 ? (
                    <View style={styles.productPrice}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text middleBody style={styles.originalPrice}>
                          {item.price} ₽
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                        }}>
                        <TouchableOpacity
                          disabled={adding}
                          onPress={() => {
                            this.onSelectProduct(item);
                          }}
                          style={styles.productSalePrice}>
                          <Text
                            middleBody
                            whiteColor
                            style={{textAlign: 'center'}}>
                            {item.promo.new_price} ₽
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      disabled={adding}
                      onPress={() => {
                        this.onSelectProduct(item);
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: BaseColor.redColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 12,
                        borderRadius: 5,
                        height: 50,
                      }}>
                      <Text middleBody redColor>
                        {item.price} ₽
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        />
      </View>
    );
  };

  minutesOfDay = (m) => {
    return m.minutes() + m.hours() * 60;
  };

  checkIsBefore(timeframe) {
    var format = 'HH:mm';
    return moment().isBefore(moment(timeframe.end, format));
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

  renderWebView = (content) => {
    var css = `<head><style type="text/css"> @font-face {
      font-family: 'SF Pro Text';
      src: url('SFProText-Regular.woff2') format('woff2'),
          url('SFProText-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    p {
      font: 14px 'SF Pro Text';
    }
    </style></head>`;
    var HTML = css + `<p style='font-family:BYekan'>${content}</p>`;
    return (
      <AutoHeightWebView
        source={{
          baseUrl: '',
          html: HTML,
        }}
        style={{
          width: Dimensions.get('window').width - 40,
          marginTop: 20,
          alignSelf: 'center',
          // color: BaseColor.grayColor,
        }}
        customStyle={`p{font-size:14px; color: ${BaseColor.grayColor}; font-family: 'SF Pro Text';}`}
      />
    );
  };

  renderDatePopup() {
    const {auth} = this.props;
    const {delivery_zone} = this.state;

    return (
      <>
        {auth.partner !== null && auth.partner?.delivery_zones.length !== 0 && (
          <RBSheet
            ref={(ref) => {
              this.DateSheet = ref;
            }}
            height={Dimensions.get('window').height / 2}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            openDuration={500}
            customStyles={{
              container: {
                backgroundColor: 'white',
                borderTopRightRadius: 29,
                borderTopLeftRadius: 29,
              },
              draggableIcon: {
                marginTop: 20,
                width: 75,
                height: 6,
                borderRadius: 3,
              },
            }}>
            <ScrollView style={{paddingHorizontal: 20}}>
              <View style={{marginTop: 30}}>
                <Text title3 bold>
                  {'Информация о времени доставки'}
                </Text>
                {this.renderWebView(auth.partner?.delivery_time_information)}
              </View>
              <View style={{marginTop: 10}}>
                <Text body1>{'Стандартные временные интервалы доставки:'}</Text>
              </View>
              <View style={{marginTop: 10}}>
                <FlatList
                  data={delivery_zone.delivery_timeframes}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <Text body2 grayColor>
                      С {item.start} до {item.end}
                    </Text>
                  )}
                />
              </View>
            </ScrollView>
          </RBSheet>
        )}
      </>
    );
  }

  renderCostPopup() {
    const {auth} = this.props;
    const {delivery_zone} = this.state;
    if (delivery_zone) {
      return (
        <>
          {auth.partner !== null && auth.partner?.delivery_zones.length !== 0 && (
            <RBSheet
              ref={(ref) => {
                this.CostSheet = ref;
              }}
              height={Dimensions.get('window').height / 2}
              closeOnDragDown={true}
              dragFromTopOnly={true}
              openDuration={500}
              customStyles={{
                container: {
                  backgroundColor: 'white',
                  borderTopRightRadius: 29,
                  borderTopLeftRadius: 29,
                },
                draggableIcon: {
                  marginTop: 20,
                  width: 75,
                  height: 6,
                  borderRadius: 3,
                },
              }}>
              <ScrollView style={{paddingHorizontal: 20}}>
                <View style={{marginTop: 30}}>
                  <Text title3 bold style={{color: BaseColor.textPrimaryColor}}>
                    {'Информация о стоимости доставки'}
                  </Text>
                  {this.renderWebView(auth.partner?.delivery_cost_information)}
                </View>
                <View style={{marginTop: 10}}>
                  <Text body1>
                    {'При заказе до '}
                    {delivery_zone.free_delivery_from}
                    {' ₽'}
                  </Text>
                  <Text body2 grayColor style={{marginTop: 5}}>
                    {'Стоимость доставки '} {delivery_zone?.delivery_price}
                    {' ₽'}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text body1>
                    {'При заказе от'} {delivery_zone.free_delivery_from}
                    {' ₽'}
                  </Text>
                  <Text body2 style={{marginTop: 5}}>
                    {'Стоимость доставки бесплатно'}
                  </Text>
                </View>
              </ScrollView>
            </RBSheet>
          )}
        </>
      );
    }
  }

  renderPromoPopup() {
    const {auth} = this.props;
    return (
      <>
        <RBSheet
          ref={(ref) => {
            this.PromoSheet = ref;
          }}
          height={Dimensions.get('window').height / 2}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          openDuration={500}
          customStyles={{
            container: {
              backgroundColor: 'white',
              borderTopRightRadius: 29,
              borderTopLeftRadius: 29,
            },
            draggableIcon: {
              marginTop: 20,
              width: 75,
              height: 6,
              borderRadius: 3,
            },
          }}>
          <ScrollView style={{paddingHorizontal: 20}}>
            <View style={{marginTop: 30}}>
              <Text title3 bold>
                {'Информация об акциях'}
              </Text>
            </View>
            {this.renderWebView(auth.partner?.promo_information)}
          </ScrollView>
        </RBSheet>
      </>
    );
  }

  renderSupplierPopup() {
    const {auth} = this.props;
    return (
      <RBSheet
        ref={(ref) => {
          this.SupplierSheet = ref;
        }}
        height={Dimensions.get('window').height / 2}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        openDuration={500}
        customStyles={{
          container: {
            backgroundColor: 'white',
            borderTopRightRadius: 29,
            borderTopLeftRadius: 29,
          },
          draggableIcon: {
            marginTop: 20,
            width: 75,
            height: 6,
            borderRadius: 3,
          },
        }}>
        <ScrollView style={{paddingHorizontal: 20}}>
          <View style={{marginTop: 30}}>
            <Text title3 bold>
              {auth.partner?.name}
            </Text>
            <Text body2 grayColor style={{marginTop: 5}}>
              {auth.partner?.address}
            </Text>
          </View>
          <View style={{marginTop: 20}}>
            <Text body2 grayColor>
              {auth.partner?.description}
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: BaseColor.grayBackgroundColor,
              width: '100%',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}>
            <Text
              caption1
              grayColor
              style={{
                fontStyle: 'italic',
                fontWeight: '300',
                lineHeight: 20,
              }}>
              {'Исполнитель: ' +
                auth.partner?.entity +
                ', ' +
                (auth.partner?.legal_address !== null
                  ? auth.partner?.legal_address
                  : '') +
                ', ИНН ' +
                auth.partner?.inn}
            </Text>
          </View>
        </ScrollView>
      </RBSheet>
    );
  }

  getAvailableDeliveryDay() {
    const {auth} = this.props;
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
    } else {
      return 'Сегодня';
    }
  }

  getAvailableDeliveryDayInCart() {
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
    } else {
      return 'Сегодня';
    }
  }

  render() {
    const {delivery_zone, loading, subCats, cart, adding} = this.state;
    var ecoPrice = this.getEconomizedPrice();

    var subCatVal = false;
    subCats.map((subCat, index) => {
      subCatVal = subCatVal || subCat;
    });
    const {auth} = this.props;
    const _cart =
      cart !== null ? cart.products : auth.totalPrice === 0 ? [] : auth.cart;

      console.log('_auth.products', auth.products);
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
            title={auth.partner?.name}
            statusBarColor={BaseColor.grayBackgroundColor}
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
              if (this.props.route.params.from === 'Category') {
                this.props.navigation.navigate('Category', {
                  id: this.props.route.params.id,
                });
              } else {
                this.props.navigation.goBack();
              }
            }}
          />
          <ScrollView>
            {/* <Animated.View */}
            <View
              style={[
                styles.imgBanner,
                {
                  // height: this._deltaY.interpolate({
                  //   inputRange: [
                  //     0,
                  //     Utils.scaleWithPixel(250),
                  //     Utils.scaleWithPixel(250),
                  //   ],
                  //   // outputRange: [heightImageBanner, heightHeader, heightHeader],
                  //   outputRange: [Utils.scaleWithPixel(260, 1), 0, 0],
                  // }),
                  height: 215,
                },
              ]}>
              {auth.partner && (
                <ImageBackground
                  source={Images.productPlaceholder}
                  imageStyle={{resizeMode: 'cover'}}
                  style={{width: Dimensions.get('window').width, height: 215}}>
                  <Image
                    source={{uri: auth.partner.mainimage_url}}
                    style={{flex: 1}}
                  />
                </ImageBackground>
              )}
              {/* <Animated.View */}
              <View
                style={{
                  zIndex: 2,
                  position: 'absolute',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  top: 20,
                  right: 20,
                  // opacity: this._deltaY.interpolate({
                  //   inputRange: [
                  //     0,
                  //     Utils.scaleWithPixel(40),
                  //     Utils.scaleWithPixel(40),
                  //   ],
                  //   outputRange: [1, 0, 0],
                  // }),
                }}>
                {auth.partner !== null && (
                  <TouchableOpacity onPress={this.onSupplierBadge}>
                    <Badge1 width={35} height={35} style={{marginRight: 5}} />
                  </TouchableOpacity>
                )}
                {auth.partner?.promo_information !== null && (
                  <TouchableOpacity onPress={this.onPromoBadge}>
                    <Badge2 width={35} height={35} />
                  </TouchableOpacity>
                )}
                {/* </Animated.View> */}
              </View>
              {/* <Animated.View */}
              <View
                style={{
                  zIndex: 2,
                  position: 'absolute',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  bottom: 20,
                  left: 20,
                  // opacity: this._deltaY.interpolate({
                  //   inputRange: [
                  //     0,
                  //     Utils.scaleWithPixel(190),
                  //     Utils.scaleWithPixel(190),
                  //   ],
                  //   outputRange: [1, 0, 0],
                  // }),
                }}>
                <TouchableOpacity
                  onPress={this.onDateBadge}
                  style={styles.blackBadge}>
                  <Text footnote whiteColor>
                    {this.getAvailableDeliveryDay()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onCostBadge}
                  style={styles.blackBadge}>
                  {delivery_zone && (
                    <Text footnote whiteColor>
                      Бесплатная доставка от {delivery_zone.free_delivery_from}{' '}
                      ₽
                    </Text>
                  )}
                </TouchableOpacity>
                {/* </Animated.View> */}
              </View>
              {/* </Animated.View> */}
            </View>
            <View style={{flex: 1}}>
              <ScrollView
                // onScroll={Animated.event(
                //   [
                //     {
                //       nativeEvent: {
                //         contentOffset: {y: this._deltaY},
                //       },
                //     },
                //   ],
                //   {useNativeDriver: false},
                // )}
                // onContentSizeChange={() =>
                //   this.setState({
                //     heightHeader: Utils.heightHeader(),
                //   })
                // }
                scrollEventThrottle={8}>
                <View
                  style={[
                    styles.contentBoxTop,
                    // { marginTop: marginTopBanner ? marginTopBanner : 215 },
                    {marginTop: 15},
                  ]}>
                  {
                    <Text
                      title1
                      style={{textAlign: 'left', marginHorizontal: 20}}>
                      {auth.partner?.name}
                    </Text>
                  }
                  {auth.subCategories && (
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={auth.subCategories}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) =>
                        this.renderTypesView(item, index)
                      }
                      style={styles.typesFlatList}
                    />
                  )}
                </View>
                <View style={{marginHorizontal: 20}}>
                  {subCatVal ? (
                    subCats.map((subCat, index) => {
                      if (
                        subCat &&
                        auth.products.filter(
                          (val) =>
                            val.subcategory_id === auth.subCategories[index].id,
                        ).length !== 0
                      ) {
                        return (
                          <View style={styles.productsFlatList}>
                            <Text title2 style={{marginBottom: 10}}>
                              {auth.subCategories[index].name}
                            </Text>
                            {/* products list by category */}
                            <FlatList
                              columnWrapperStyle={{marginBottom: 10}}
                              numColumns={2}
                              data={auth.products.filter(
                                (val) =>
                                  val.subcategory_id ===
                                    auth.subCategories[index].id &&
                                  val.archived === 0,
                              )}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item, index}) => (
                                <View
                                  style={[
                                    styles.productsView,
                                    index % 2 ? {marginLeft: 10} : {},
                                  ]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.props.navigation.navigate(
                                        'ProductShow',
                                        {
                                          productID: item.id,
                                          quantity:
                                            _cart &&
                                            _cart.find(
                                              (val) =>
                                                val.productID === item.id,
                                            ) === undefined
                                              ? 0
                                              : _cart.find(
                                                  (val) =>
                                                    val.productID === item.id,
                                                ).quantity,
                                        },
                                      );
                                    }}>
                                    {item.hasPromo === 1 && (
                                      <Badge2
                                        width={35}
                                        height={35}
                                        style={{
                                          position: 'absolute',
                                          top: 5,
                                          right: 5,
                                          zIndex: 2,
                                        }}
                                      />
                                    )}
                                    <ImageBackground
                                      source={Images.productPlaceholder}
                                      imageStyle={{resizeMode: 'cover'}}
                                      style={styles.productImg}>
                                      <Image
                                        source={
                                          item.images[0].image_url
                                            ? {uri: item.images[0].image_url}
                                            : Images.productPlaceholder
                                        }
                                        resizeMode="cover"
                                        style={styles.productImg}
                                      />
                                    </ImageBackground>
                                  </TouchableOpacity>
                                  <Text body1 style={{marginVertical: 12}}>
                                    {item.name}
                                  </Text>
                                  {_cart &&
                                  _cart.find((x) => x.productID === item.id) !==
                                    undefined ? (
                                    <View style={styles.countBtn}>
                                      <View style={styles.countBtnInside}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.onMinusBtn(item.id);
                                          }}>
                                          <Minus width={18} height={18} />
                                        </TouchableOpacity>
                                        <Text
                                          title3
                                          bold
                                          style={{marginHorizontal: 20}}>
                                          {/* {
                                          cart.products[
                                            cart.products.findIndex(
                                              (x) => x.productID === item.id,
                                            )
                                          ].quantity
                                        } */}
                                          {_cart &&
                                            _cart.find(
                                              (x) => x.productID === item.id,
                                            ).quantity}
                                        </Text>
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.onPlusBtn(item.id);
                                          }}>
                                          <Plus width={18} height={18} />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  ) : (
                                    <>
                                      {item.hasPromo !== 0 ? (
                                        <View style={styles.productPrice}>
                                          <View
                                            style={{
                                              flex: 1,
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                            }}>
                                            <Text
                                              middleBody
                                              style={styles.originalPrice}>
                                              {item.price} ₽
                                            </Text>
                                          </View>
                                          <View
                                            style={{
                                              flex: 1,
                                            }}>
                                            <TouchableOpacity
                                              disabled={adding}
                                              onPress={() => {
                                                this.onSelectProduct(item);
                                              }}
                                              style={styles.productSalePrice}>
                                              <Text
                                                middleBody
                                                whiteColor
                                                style={{textAlign: 'center'}}>
                                                {item.promo.new_price} ₽
                                              </Text>
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                      ) : (
                                        <TouchableOpacity
                                          disabled={adding}
                                          onPress={() => {
                                            this.onSelectProduct(item);
                                          }}
                                          style={{
                                            borderWidth: 1,
                                            borderColor: BaseColor.redColor,
                                            height: 50,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingVertical: 12,
                                            borderRadius: 5,
                                          }}>
                                          <Text middleBody redColor>
                                            {item.price} ₽
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    </>
                                  )}
                                </View>
                              )}
                            />
                          </View>
                        );
                      }
                    })
                  ) : (
                    <FlatList
                      showsScrollIndicator={false}
                      data={auth.subCategories}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) =>
                        this.renderAllProductsView(index)
                      }
                      style={styles.productsFlatList}
                    />
                  )}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
          {this.checkMinimalCheckout() && (
            <View style={styles.minimalWarning}>
              <Text body2 style={{textAlign: 'center', color: 'white'}}>
                {'Минимальная сумма заказа ' +
                  delivery_zone?.min_order_price +
                  ' руб.'}
              </Text>
            </View>
          )}
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
                    <Text title2>{auth.totalPrice} ₽</Text>
                  </>
                ) : (
                  <View style={{alignItems: 'flex-start'}}>
                    <Text title2 semiBold>
                      {auth.totalPrice} ₽
                    </Text>
                    <Text>{this.getAvailableDeliveryDayInCart()}</Text>
                  </View>
                )}
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  // disabled={this.checkMinimalCheckout()}
                  onPress={() => {
                    this.props.navigation.navigate('Cart');
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 5,
                    // height: 44,
                    paddingVertical: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: !this.checkMinimalCheckout()
                    //   ? BaseColor.redColor
                    //   : '#F1F1F1',
                    backgroundColor: BaseColor.redColor,
                    marginRight: 10,
                  }}>
                  <Text
                    middleBody
                    semiBold
                    style={{
                      // color: !this.checkMinimalCheckout() ? 'white' : '#B3B3B3',
                      color: 'white',
                    }}>
                    {'В корзину'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.renderDatePopup()}
          {this.renderCostPopup()}
          {this.renderPromoPopup()}
          {this.renderSupplierPopup()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
