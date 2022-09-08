import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {BaseColor, Images} from '@config';
import {Text, TextInput, Image, Icon} from '@components';
import styles from './styles';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Logo from '../../assets/svgs/logoicon.svg';
import ChatBox from '../../assets/svgs/chatbox.svg';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import Emoji from 'react-native-emoji';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {bindActionCreators} from 'redux';
import {AuthActions} from '@actions';
import Spinner from 'react-native-loading-spinner-overlay';
import Intercom from 'react-native-intercom';

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onChatBtn = () => {
    const {auth} = this.props;
    if (auth.isGuest) {
      Intercom.registerUnidentifiedUser();
    } else {
      Intercom.registerIdentifiedUser({userId: auth.user.phoneNumber});
      Intercom.updateUser({
        // Pre-defined user attributes
        // email: 'bob@intercom.com',
        // user_id: 'user_id',
        // name: 'Bob',
        phone: auth.user.phoneNumber,
        // language_override: 'language_override',
        // signed_up_at: 1004,
        unsubscribed_from_emails: true,
        // companies: [
        //   {
        //     company_id: 'bob@company-email-id.com',
        //     name: 'Guest',
        //   },
        // ],
        // custom_attributes: {
        //   my_custom_attribute: 123,
        // },
      });
    }

    Intercom.displayMessageComposer();
    this.props.navigation.closeDrawer();
  };

  onLogo = () => {
    const {auth, navigation} = this.props;
    if (auth.addresses.length === 0) {
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
    } else {
      navigation.navigate('Catalogue');
    }
  };

  onMyProfileBtn = () => {
    const {navigation, auth, actions} = this.props;
    if (auth.user === null) {
      navigation.navigate('SignIn');
    } else {
      navigation.navigate('ProfileEdit');
    }
  };

  render() {
    const {loading} = this.state;
    const {auth, navigation} = this.props;
    return (
      <>
        <Spinner visible={loading} color="#FF2D34" />

        {Platform.OS === 'ios' && (
          <View
            style={{
              height: getStatusBarHeight(true),
              backgroundColor: 'white',
            }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
          </View>
        )}
        <TouchableOpacity onPress={this.onLogo} style={styles.drawerHeader}>
          <Logo width={54} height={54} />
          <View style={styles.drawerHeaderContent}>
            <Text style={styles.drawerHeaderText}>{'Local Market'}</Text>
          </View>
        </TouchableOpacity>
        <DrawerContentScrollView {...this.props}>
          <DrawerItem
            label="Адреса"
            labelStyle={{marginLeft: -25, color: BaseColor.textPrimaryColor}}
            icon={({focused, color, size}) => (
              <IoniconsIcon
                color={BaseColor.redColor}
                size={size}
                name="location-outline"
                style={styles.icon}
              />
            )}
            onPress={() => {
              navigation.navigate('Address1');
            }}
            activeTintColor={BaseColor.drawerTintColor}
          />
          <DrawerItem
            label="Заказы"
            labelStyle={{marginLeft: -25, color: BaseColor.textPrimaryColor}}
            icon={({focused, color, size}) => (
              <IoniconsIcon
                color={BaseColor.redColor}
                size={size}
                name="cube-outline"
                style={styles.icon}
              />
            )}
            onPress={() => {
              navigation.navigate('Orders', {from: 'DrawerContent'});
            }}
            activeTintColor={BaseColor.drawerTintColor}
          />
          <DrawerItem
            label="Профиль"
            labelStyle={{marginLeft: -25, color: BaseColor.textPrimaryColor}}
            icon={({focused, color, size}) => (
              <FeatherIcon
                color={BaseColor.redColor}
                size={size}
                name="user"
                style={styles.icon}
              />
            )}
            onPress={() => {
              this.onMyProfileBtn();
            }}
            activeTintColor={BaseColor.drawerTintColor}
          />
          <DrawerItem
            label="О сервисе"
            labelStyle={{marginLeft: -25, color: BaseColor.textPrimaryColor}}
            icon={({focused, color, size}) => (
              <FeatherIcon
                color={BaseColor.redColor}
                size={size}
                name="file-text"
                style={styles.icon}
              />
            )}
            onPress={() => {
              navigation.navigate('About');
            }}
            activeTintColor={BaseColor.drawerTintColor}
          />
        </DrawerContentScrollView>
        <TouchableOpacity
          onPress={this.onChatBtn}
          style={styles.versionContainer}>
          <ChatBox width={54} height={54} />
          <View style={{marginLeft: 10, width: '70%'}}>
            <Text body1 style={{color: BaseColor.textPrimaryColor}}>
              {'Чат поддержки'}
            </Text>
            <Text body2 grayColor>
              {'Позвоните или напишите нам'}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
