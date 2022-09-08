import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {View, Dimensions} from 'react-native';
import {bindActionCreators} from 'redux';
import {Header, SafeAreaView} from '@components';
import styles from './styles';
import {BaseColor} from '@config';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

const scalesPageToFit = Platform.OS === 'android';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}
class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      document: [],
    };
  }

  onFocus = () => {
    this.setState({document: this.props.route.params.document});
  };

  onWebViewMessage = (event: WebViewMessageEvent) => {
    this.setState({webViewHeight: Number(event.nativeEvent.data)});
  };

  renderWebView = (content) => {
    const generateHtml =
      `
      <!DOCTYPE html>\n
      <html>
        <head>
          <title>Web View</title>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=` +
      Dimensions.get('window').width +
      `, user-scalable=no">
          <style type="text/css">
            body {
              margin: 0;
              padding: 0;
              max-width: 100%;
              overflow-x: hidden;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
      `;
    return (
      <WebView
        scalesPageToFit={scalesPageToFit}
        bounces={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        source={{html: generateHtml}}
        onMessage={this.onWebViewMessage}
        injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
      />
    );
  };

  render() {
    const {document} = this.state;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <SafeAreaView style={styles.contain} forceInset={{top: 'never'}}>
          <Header
            style={{backgroundColor: 'white'}}
            title={document.title}
            renderLeft={() => {
              return (
                <FeatherIcon
                  name="chevron-left"
                  size={30}
                  color={BaseColor.redColor}
                />
              );
            }}
            onPressLeft={() => {
              this.props.navigation.goBack();
            }}
          />
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              backgroundColor: 'white',
              padding: 5,
            }}>
            {document.length !== 0 && this.renderWebView(document.content)}
          </View>
        </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);
