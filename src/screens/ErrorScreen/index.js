import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '@actions';
import {
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { Text, Header, SafeAreaView } from '@components';
import styles from './styles';
import { BaseColor, BaseSize } from '@config';
import ErrorScreenSvg from '../../assets/svgs/errorScreen.svg';
import NetworkError from '../../assets/svgs/networkError.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';

class ErrorScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideSize: Dimensions.get('window').width - 80,
      fromLoading: false,
      message: null,
      errMsg: null,
      errorType: null,
    };
  }

  componentDidMount() {
    if (this.props.route.params !== undefined) {
      const { message } = this.props.route.params;
      if (message === 'Network Error') {
        this.setState({ errMsg: 'Ошибка сети', errorType: 'networkError' });
      } else if (message === 'Request failed with status code 401') {
        this.setState({ errMsg: 'Пожалуйста, повторите попытку позже' });
      } else {
        this.setState({ errMsg: message });
      }
      this.setState({ fromLoading: true });
    }
    Alert.alert(
      'Ошибка',
      'Не удалось загрузить данные. Пожалуйста, повторите позднее.',
      [
        {
          text: 'Закрыть',
          onPress: () => {},
        },
      ],
    );
  }

  onSkip = () => {
    this.props.navigation.navigate('SignIn');
  };

  checkInput = () => {
    return true;
  };

  onGoBackBtn = () => {
    const { actions } = this.props;
    const { navigation } = this.props;
    const { fromLoading } = this.state;
    actions.setLoadingFalse();
    navigation.goBack();
  };

  render() {
    const { slideSize, errMsg, errorType } = this.state;
    return (
      <SafeAreaView style={styles.contain} forceInset={{ top: 'never' }}>
        <Header
          title="Адреса"
          whiteHeaderColor
          renderLeft={() => {
            return (
              <FeatherIcon
                name="chevron-left"
                size={BaseSize.headerIconSize}
                color={BaseColor.redColor}
              />
            );
          }}
          onPressLeft={this.onGoBackBtn}
        />
        {errorType === 'networkError' ? (
          <NetworkError
            width={slideSize}
            height={slideSize}
            style={{ alignSelf: 'center' }}
          />
        ) : (
          <ErrorScreenSvg
            width={slideSize}
            height={slideSize}
            style={{ alignSelf: 'center' }}
          />
        )}

        <View style={{ flex: 3, padding: 50, alignItems: 'center' }}>
          <Text title2 style={{ paddingBottom: 20 }}>
            {'Упс! Возникла ошибка'}
          </Text>
          <Text>{errMsg}</Text>
          <Text>{'Вернитесь и попробуйте сначала'}</Text>
        </View>
        <TouchableOpacity
          onPress={this.onGoBackBtn}
          style={{
            backgroundColor: BaseColor.redColor,
            marginBottom: 50,
            marginHorizontal: 50,
            paddingVertical: 10,
            borderRadius: 5,
          }}>
          <Text
            body1
            style={{ color: BaseColor.whiteColor, textAlign: 'center' }}>
            {'Вернуться назад'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorScreen);
