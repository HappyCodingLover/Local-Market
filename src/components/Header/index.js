import React, { Component } from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import Text from '../Text';
import styles from './styles';
import PropTypes from 'prop-types';
import { BaseColor } from '@config';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default class Header extends Component {
  componentDidMount() {
    // StatusBar.setBarStyle(this.props.barStyle, true);
  }

  componentWillUnmount() {
    // StatusBar.setBarStyle('dark-content', true);
  }

  render() {
    const {
      whiteHeaderColor,
      style,
      styleLeft,
      styleCenter,
      styleRight,
      styleRightSecond,
      title,
      subTitle,
      onPressLeft,
      onPressCenter,
      onPressRight,
      onPressRightSecond,
      titleClickable,
      statusBarColor,
    } = this.props;

    return (
      <>
        <View
          style={[
            {
              height: getStatusBarHeight(true),
              // backgroundColor: BaseColor.textPrimaryColor,
              backgroundColor: statusBarColor,
            },
          ]}>
          <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} />
        </View>
        <View style={[styles.contain, style]}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.contentLeft, styleLeft]}
              onPress={onPressLeft}>
              {this.props.renderLeft()}
            </TouchableOpacity>
          </View>
          <View style={[styles.contentCenter, styleCenter]}>
            {title === '' ? (
              this.props.renderCenter()
            ) : titleClickable ? (
              <TouchableOpacity onPress={onPressCenter}>
                {/* {this.props.renderCenter()} */}
                <Text
                  headline
                  style={{ color: BaseColor.textPrimaryColor }}
                  numberOfLines={1}>
                  {title}
                </Text>
                {subTitle !== '' && (
                  <Text caption2 light textPrimaryColor>
                    {subTitle}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <>
                <Text headline textPrimaryColor numberOfLines={1}>
                  {title}
                </Text>
                {subTitle !== '' && (
                  <Text caption2 light textPrimaryColor>
                    {subTitle}
                  </Text>
                )}
              </>
            )}
          </View>
          <View style={styles.right}>
            <TouchableOpacity
              style={[styles.contentRightSecond, styleRightSecond]}
              onPress={onPressRightSecond}>
              {this.props.renderRightSecond()}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contentRight, styleRight]}
              onPress={onPressRight}>
              {this.props.renderRight()}
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

Header.propTypes = {
  whiteHeaderColor: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRightSecond: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderCenter: PropTypes.func,
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,
  renderRightSecond: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  onPressCenter: PropTypes.func,
  onPressRightSecond: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  barStyle: PropTypes.string,
  titleClickable: PropTypes.bool,
  statusBarColor: PropTypes.string,
};

Header.defaultProps = {
  whiteHeaderColor: false,
  titleClickable: false,
  style: {},
  styleLeft: {},
  styleCenter: {},
  styleRight: {},
  styleRightSecond: {},
  renderCenter: () => {},
  renderLeft: () => {},
  renderRight: () => {},
  renderRightSecond: () => {},
  onPressLeft: () => {},
  onPressCenter: () => {},
  onPressRight: () => {},
  onPressRightSecond: () => {},
  title: 'Title',
  subTitle: '',
  barStyle: 'dark-content',
  statusBarColor: 'white',
};
