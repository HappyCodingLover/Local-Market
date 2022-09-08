import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {View, Dimensions, Alert, TouchableOpacity} from 'react-native';
import {bindActionCreators} from 'redux';
import {Text, Header, Image, SafeAreaView} from '@components';
import styles from './styles';
import {BaseColor, BaseSize} from '@config';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

function FocusEfect({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus]),
  );

  return null;
}

class Article extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      scrollEnabled: true,
      article: [],
      content: '<p>hello, world!</p>',
    };
  }

  onFocus = () => {
    this.setState({article: this.props.route.params.article});
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
            }
            p{font-size:20px; font-family: 'Verdana';}
          </style>
          <script>
          document.querySelector("button").onclick = function() {
            window.postMessage("Hello React", "*");
          }
          </script>
        </head>
        <body>
          ${content}
        </body>
      </html>
      `;
    return (
      <WebView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // style={{ height: this.state.webViewHeight, borderWidth: 3 }}
        style={{flex: 1}}
        source={{html: generateHtml}}
        onMessage={this.onWebViewMessage}
        customStyle={`p{font-size:20px; color: ${BaseColor.grayColor}; font-family: 'Verdana';}`}
        injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
      />
    );
  };

  onMessage(m) {
    //Prints out data that was passed.
  }

  renderContentView(item, index) {
    return (
      <>
        <Image source={item.img} style={styles.contentImg} resizeMode="cover" />
        <Text body1 style={styles.textSpace}>
          {item.subtitle}
        </Text>
        <Text>{item.text}</Text>
      </>
    );
  }

  render() {
    const {article, content} = this.state;
    return (
      <>
        <FocusEfect onFocus={this.onFocus} />
        <SafeAreaView style={styles.contain} forceInset={{top: 'never'}}>
          <Header
            title="Полезная информация"
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
            onPressLeft={() => {
              this.props.navigation.goBack();
            }}
          />
          <View style={{flex: 1, marginHorizontal: 20}}>
            {this.renderWebView(article.content)}
          </View>
          {article.company !== null && (
            <TouchableOpacity
              onPress={() => {
                if (
                  this.props.auth?.catalogues.find(
                    (partner) => partner.id === article.company.id,
                  ) === undefined
                ) {
                  Alert.alert('Этот магазин недоступен по вашему адресу');
                } else {
                  this.props.actions.setPartner(
                    this.props.auth?.catalogues.find(
                      (partner) => partner.id === article.company.id,
                    ),
                  );
                  this.props.navigation.navigate('ProductDetail', {
                    from: 'Article',
                  });
                }
              }}
              style={{
                backgroundColor: BaseColor.redColor,
                borderRadius: 5,
                marginHorizontal: 20,
                padding: 10,
                marginBottom: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text title3 style={{color: 'white'}}>
                К партнеру
              </Text>
            </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Article);
