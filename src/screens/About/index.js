import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {View, Dimensions, FlatList, ImageBackground} from 'react-native';
import {bindActionCreators} from 'redux';
import {Text, Image, Header} from '@components';
import styles from './styles';
import {BaseColor, BaseSize, Images} from '@config';
import BackgroundFull from '../../assets/svgs/backgroundFull.svg';
import LogoWhite from '../../assets/svgs/logoWhite.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {GuestServices} from '../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import {BackendConfiguration} from '../../config/backend';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      documents: [],
      version: '1.0.1',
    };
  }

  onFocus = () => {
    const {navigation} = this.props;
    this.setState({loading: true});
    GuestServices.getDocuments()
      .then((response) => {
        if (response.data.success === 1) {
          this.setState({documents: response.data.data});
        } else {
          console.error(
            'something went wrong while getting documents',
            response.data.message,
          );
          navigation.navigate('ErrorScreen', {
            message: response.data.message,
          });
        }
      })
      .catch((err) => {
        console.error('err while getting documents', err);
        navigation.navigate('ErrorScreen', {
          message: err.message,
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
  };

  render() {
    const {loading, documents, version} = this.state;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <Spinner visible={loading} color="#FF2D34" />
        <Header
          title="О сервисе"
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
            this.props.navigation.openDrawer();
          }}
          style={{backgroundColor: BaseColor.grayBackgroundColor}}
          statusBarColor={BaseColor.grayBackgroundColor}
        />
        <View
          style={[
            styles.mainContainer,
            {backgroundColor: BaseColor.grayBackgroundColor},
          ]}>
          <BackgroundFull
            style={{alignSelf: 'center'}}
            width={(Dimensions.get('window').width * 4) / 3}
            height={(Dimensions.get('window').height * 5) / 8}
          />
          <View
            style={{
              backgroundColor: BaseColor.grayBackgroundColor,
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              top: (Dimensions.get('window').height * 5) / 16 - 50,
              left: Dimensions.get('window').width / 2 - 100,
              zIndex: 2,
            }}>
            <LogoWhite width={66.37} height={64} />
            <View style={{marginLeft: 11}}>
              <Text body1>{'Local Market'}</Text>
              <Text body2>{'Версия ' + version}</Text>
            </View>
          </View>

          <FlatList
            columnWrapperStyle={{marginHorizontal: 20}}
            numColumns={2}
            data={documents}
            keyExtractor={(item) => item?.id}
            renderItem={({item, index}) => (
              <View
                style={[{marginBottom: 10}, index % 2 ? {marginLeft: 10} : {}]}>
                <TouchableOpacity
                  onPress={() => {
                    // return;
                    this.props.navigation.navigate('PrivacyPolicy', {
                      document: item,
                    });
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      paddingHorizontal: 12,
                      paddingVertical: 16,
                      borderRadius: 10,
                      width: (Dimensions.get('window').width - 50) / 2,
                      height: (Dimensions.get('window').width - 50) / 4,
                    }}>
                    <ImageBackground
                      source={Images?.productPlaceholder}
                      imageStyle={{borderRadius: 10}}
                      style={styles.typeImg}>
                      <Image
                        source={{
                          uri: `${BackendConfiguration.ADMINPANEL_URL}/media/documentIcons/${item.icon}`,
                        }}
                        style={styles.typeImg}
                        resizeMode="contain"
                      />
                    </ImageBackground>
                    <Text body2 style={styles.buttonCaption}>
                      {item?.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
