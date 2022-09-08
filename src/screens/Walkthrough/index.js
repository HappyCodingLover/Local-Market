import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '@actions';
import { View, Dimensions } from 'react-native';
import { bindActionCreators } from 'redux';
import { Text, Header, SafeAreaView } from '@components';
import styles from './styles';
import { BaseSize } from '@config';
import WalkThrough1 from '../../assets/svgs/walkthrough1.svg';
import WalkThrough2 from '../../assets/svgs/walkthrough2.svg';
import WalkThrough3 from '../../assets/svgs/walkthrough3.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppIntroSlider from 'react-native-app-intro-slider';
import FeatherIcon from 'react-native-vector-icons/Feather';
// import {
//   requestNotifications,
//   checkNotifications,
// } from 'react-native-permissions';

class Walkthrough extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      slideSize: Dimensions.get('window').width - 40,
      entries: [
        {
          title: 'Добро пожаловать в Local Market',
          text: 'Покупая продукты через приложение, вы поддерживаете малый бизнес',
          image: (
            <WalkThrough1
              width={Dimensions.get('window').width - 50}
              height={Dimensions.get('window').width - 50}
            />
          ),
        },
        {
          title: 'Как быстро мне доставят продукты?',
          text: 'Продукты доставляют в день заказа или на следующий день по Москве и МО',
          image: (
            <WalkThrough2
              width={Dimensions.get('window').width - 50}
              height={Dimensions.get('window').width - 50}
            />
          ),
        },
        {
          title: 'С какими магазинами мы работаем?',
          text: 'Мы объединяем частных предпринимателей и локальные магазины',
          image: (
            <WalkThrough3
              width={Dimensions.get('window').width - 50}
              height={Dimensions.get('window').width - 50}
            />
          ),
        },
      ],
      activeSlide: 0,
      curIndex: 0,
      prevIndex: 0,
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.setWelcome(true);
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 4, alignItems: 'center' }}>{item.image}</View>
        <View style={{ flex: 0.6, marginHorizontal: 20 }}>
          <Text title2 style={{ textAlign: 'center' }}>
            {item.title}
          </Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: 30 }}>
          <Text middleBody grayColor style={{ textAlign: 'center' }}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  _renderPagination = (activeIndex) => {
    const { entries } = this.state;
    return (
      <View style={styles.paginationContainer}>
        <SafeAreaView forceInset={{ top: 'never' }}>
          <TouchableOpacity onPress={this.onSkip}>
            <View
              style={{
                marginBottom: 20,
                width: 100,
                height: 30,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text redColor style={{ textAlign: 'center' }}>
                {'Пропустить'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.paginationDots}>
            {entries.length > 1 &&
              entries.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex
                      ? { backgroundColor: 'black' }
                      : { backgroundColor: 'rgba(0, 0, 0, .4)' },
                  ]}
                  onPress={() => this.slider?.goToSlide(i, true)}
                />
              ))}
          </View>
        </SafeAreaView>
      </View>
    );
  };

  _onSnapToItem = (index) => {
    this.setState({ activeSlide: index });
    const { curIndex, prevIndex } = this.state;
    const { navigation } = this.props;
    if (index === 3 && curIndex === 2 && prevIndex === 1) {
      navigation.navigate('SignIn');
    } else {
      this.setState({ curIndex: index });
      this.setState({ prevIndex: curIndex });
    }
  };

  onSkip = () => {
    this.props.navigation.navigate('SignIn');
  };

  _onDone = () => {
    this.props.navigation.navigate('SignIn');
  };

  _keyExtractor = (item) => item.title;

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FeatherIcon
          name="arrow-right"
          size={BaseSize.headerMenuIconSize}
          color={'black'}
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <FeatherIcon
          name="check"
          size={BaseSize.headerMenuIconSize}
          color={'black'}
        />
      </View>
    );
  };

  render() {
    const { entries } = this.state;
    return (
      <SafeAreaView style={styles.contain} forceInset={{ top: 'never' }}>
        <Header title="Как это работает" whiteHeaderColor />
        <View style={styles.mainContainer}>
          <AppIntroSlider
            renderItem={this._renderItem}
            // renderPagination={this._renderPagination}
            data={entries}
            renderDoneButton={this._renderDoneButton}
            renderNextButton={this._renderNextButton}
            onDone={this._onDone}
            keyExtractor={this._keyExtractor}
            dotStyle={{ backgroundColor: 'rgba(0, 0, 0, .4)' }}
            activeDotStyle={{ backgroundColor: 'black' }}
          />
        </View>
      </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);
