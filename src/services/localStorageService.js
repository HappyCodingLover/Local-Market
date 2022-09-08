import AsyncStorage from '@react-native-community/async-storage';

const LocalStorageService = (function () {
  var _service;

  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }

  async function _setToken(token) {
    await AsyncStorage.setItem('@access_token', token);
  }

  async function _getToken() {
    const token = await AsyncStorage.getItem('@access_token');
    return token;
  }

  function _clearToken() {
    AsyncStorage.removeItem('@access_token');
  }

  return {
    getService: _getService,
    setToken: _setToken,
    getToken: _getToken,
    clearToken: _clearToken,
  };
})();

export default LocalStorageService;
