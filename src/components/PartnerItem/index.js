import React, {Component} from 'react';
import {TouchableOpacity, Image, View, ImageBackground} from 'react-native';
import styles from './styles';
import Text from '../Text';
import PropTypes from 'prop-types';
import {Images} from '@config';
import moment from 'moment-timezone';

export default class PartnerItem extends Component {
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
    var availableTimeframes = [];
    deliveryZone?.delivery_timeframes?.map((timeframe, index) => {
      if (this.checkIsBefore(timeframe) || this.checkIsBetween(timeframe)) {
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
  }

  render() {
    const {item, deliveryZone, ...rest} = this.props;
    return (
      <TouchableOpacity {...rest} activeOpacity={1}>
        <ImageBackground
          source={Images.productPlaceholder}
          imageStyle={{borderRadius: 10}}
          style={styles.partnerImgBackground}>
          <Image source={{uri: item.mainimage_url}} style={styles.partnerImg} />
        </ImageBackground>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: 12,
            bottom: 78,
          }}>
          <View style={styles.partnerDateBadge}>
            <Text footnote whiteColor>
              {this.getAvailableDeliveryDay(deliveryZone)}
            </Text>
          </View>
          {item.min_order_price !== null && deliveryZone && (
            <View style={styles.partnerDescriptionBadge}>
              <Text footnote whiteColor>
                Заказ От {deliveryZone.min_order_price} ₽
              </Text>
            </View>
          )}
        </View>
        <Text title3 style={{marginTop: 10, marginBottom: 30}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }
}

PartnerItem.propTypes = {
  // style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // icon: PropTypes.node,
  // outline: PropTypes.bool,
  // full: PropTypes.bool,
  // round: PropTypes.bool,
  // loading: PropTypes.bool,
  item: PropTypes.object,
};

PartnerItem.defaultProps = {
  // style: {},
  // icon: null,
  // outline: false,
  // full: false,
  // round: false,
  // loading: false,
  item: {},
};
