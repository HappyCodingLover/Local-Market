import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '@actions';
import { bindActionCreators } from 'redux';
import {
  View,
  StatusBar,
  BackHandler,
  ScrollView,
} from 'react-native';
import { BaseStyle, BaseColor, BaseSize } from '@config';
import { Text, SafeAreaView } from '@components';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Background from '../../assets/svgs/background.svg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import fbauth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const PhoneVerification = (props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resent, setResent] = useState(false);
  const [buttonCaption, setButtonCaption] = useState('Отправить код еще раз');
  const [time, setTime] = useState(60);
  const [confirm, setConfirm] = useState(props.route.params.confirm);
  const [value, setValue] = useState('');
  const [downCount, setDownCount] = useState(false);
  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ code, cellCount: CELL_COUNT });
  const [_props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (downCount) {
      setTimeout(() => setTime(time - 1), 1000);
      if (time === 0) {
        setDownCount(false);
      }
      changing_caption();
    } else {
      setResent(false);
      setButtonCaption('Отправить код ещё раз');
      setTime(60);

      return;
    }
  }, [time, downCount]);

  useEffect(() => {
    setTimeout(() => CodeFieldRef.current.focus(), 150)
  }, []);

  const CodeFieldRef = useRef(null);

  const { t, auth } = props;

  const _checkCode = (text) => {
    if (text.length === 6) {
      onSignIn(text);
    }
  };

  const onBack = () => {
    props.navigation.goBack();
  };

  const onSignIn = async (text) => {
    const { actions } = props;
    actions.setLoadingTrue();
    try {
      await actions.setGuestFalse();
      await confirm.confirm(text);
      
      actions.setLoadingFalse();
    } catch (error) {
      await actions.setGuestTrue();
      setShowError(true);
      setErrorMsg('Код введён неверно, повторите попытку');

      actions.setLoadingFalse();
      setTimeout(() => {
        setCode('');
        setErrorMsg('');
        setShowError(false);
      }, 2000);
    }
  };

  const changing_caption = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    setButtonCaption(
      min !== 0
        ? 'Повторить отправку ' + '01 : 00'
        : 'Повторить отправку ' + '00 : ' + sec,
    );
  };

  const onResendCodeBtn = () => {
    if (resent) {
      showMessage({
        message: 'Код был отправлен повторно, пожалуйста, подождите',
        type: 'success',
        icon: 'auto',
        duration: 2500,
      });
    } else {
      setResent(true);
      setCode('');
      showMessage({
        message: 'Мы отправили код заново, ожидайте',
        type: 'success',
        icon: 'auto',
        duration: 2500,
      });
      const { phoneNumber } = props.route.params;
      setLoading(true);
      fbauth()
        .signInWithPhoneNumber(phoneNumber, true)
        .then((confirmation) => {
          setConfirm(confirmation);
        })
        .catch((error) => {
          console.error('error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
      setDownCount(true);
    }
  };

  const renderSpinner = (loading) => {
    return <Spinner visible={loading} color="#FF2D34" />;
  };

  return (
    <AndroidBackHandler
      onBackPress={() => {
        BackHandler.exitApp();
        return true;
      }}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={BaseStyle.safeAreaView}>
        {renderSpinner(auth._loading)}
        {/* {renderSpinner(false)} */}
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor="white"
        />
        <SafeAreaView style={styles.contain}>
          <Background style={styles.background} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.headerLeft} onPress={onBack}>
                <FeatherIcon
                  name="chevron-left"
                  size={BaseSize.headerIconSize}
                  color={BaseColor.redColor}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
          <View style={styles.topContainer}>
            <View style={styles.logoView}></View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 150 }}>
            <Text
              body2
              style={{ color: BaseColor.lightGrayColor, marginBottom: 9 }}>
              {'Введите код из СМС'}
            </Text>
            <View style={styles.codeWrapper}>
              <CodeField
                ref={CodeFieldRef}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  _checkCode(text);
                }}
                cellCount={CELL_COUNT}
                // rootStyle={{ backgroundColor: 'transparent' }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[
                      symbol ? styles.cell : styles.cell2,
                      isFocused && styles.focusCell,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : '0')}
                  </Text>
                )}
              />
            </View>

            {showError && (
              <Text
                body2
                style={{
                  marginTop: 25,
                  textAlign: 'center',
                  color: '#5858583D',
                }}>
                {errorMsg}
              </Text>
            )}
          </View>
          <TouchableOpacity
            disabled={resent}
            onPress={onResendCodeBtn}
            style={{ alignItems: 'center', marginTop: 24 }}>
            <Text body2 redColor>
              {buttonCaption}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </AndroidBackHandler>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneVerification);
