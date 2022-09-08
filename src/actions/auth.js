import * as actionTypes from './actionTypes';
// import { UserServices } from '@services';
import { UserServices } from '../services';

const onLoginStart = () => {
  return {
    type: actionTypes.LOGIN_START,
  };
};

const onLoginSuccess = (payload) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload,
  };
};

const onLoginError = (payload) => {
  return {
    type: actionTypes.LOGIN_ERROR,
    payload,
  };
};

const onLogoutStart = () => {
  return {
    type: actionTypes.LOGOUT_START,
  };
};

const onLogoutSuccess = () => {
  return {
    type: actionTypes.LOGOUT_SUCCESS,
  };
};

const onLogoutError = (payload) => {
  return {
    type: actionTypes.LOGOUT_ERROR,
    payload,
  };
};

const onRegisterStart = () => {
  return {
    type: actionTypes.REGISTER_START,
  };
};

const onRegisterSuccess = () => {
  return {
    type: actionTypes.REGISTER_SUCCESS,
  };
};

const onRegisterError = (payload) => {
  return {
    type: actionTypes.REGISTER_ERROR,
    payload,
  };
};

const onProfileImage = (payload) => {
  return {
    type: actionTypes.SAVE_PROFILE_IMAGE,
    payload,
  };
};

const onUpdateName = (payload) => {
  return {
    type: actionTypes.SAVE_PROFILE_NAME,
    payload,
  };
};

const onRegisterNewAddress = (payload) => {
  return {
    type: actionTypes.REGISTER_ADDRESS,
    payload,
  };
};

const onSaveAddresses = (payload) => {
  return {
    type: actionTypes.SAVE_ADDRESS,
    payload,
  };
};

const onSetActiveAddress = (payload) => {
  return {
    type: actionTypes.SET_ACTIVE_ADDRESS,
    payload,
  };
};

const onSetPartner = (payload) => {
  return {
    type: actionTypes.SET_PARTNER,
    payload,
  };
};

const onClearPartner = () => {
  return {
    type: actionTypes.CLEAR_PARTNER,
  };
};

const onSetCategory = (payload) => {
  return {
    type: actionTypes.SET_CATEGORY,
    payload,
  };
};

const onClearCategory = () => {
  return {
    type: actionTypes.CLEAR_CATEGORY,
  };
};

const onSaveCategories = (payload) => {
  return {
    type: actionTypes.SAVE_CATEGORIES,
    payload,
  };
};

const onClearCategories = () => {
  return {
    type: actionTypes.CLEAR_CATEGORIES,
  };
};

const onClearSubCategory = () => {
  return {
    type: actionTypes.CLEAR_SUBCATEGORY,
  }
}

const onSetCart = (payload) => {
  return {
    type: actionTypes.SET_CART,
    payload,
  };
};

const onClearCart = () => {
  return {
    type: actionTypes.CLEAR_CART,
  };
};

const onAddToCart = (payload) => {
  return {
    type: actionTypes.ADD_TO_CART,
    payload,
  };
};

const onAddTotalPrice = (payload) => {
  return {
    type: actionTypes.ADD_TOTALPRICE,
    payload,
  };
};

const onAddDiscountPrice = (payload) => {
  return {
    type: actionTypes.ADD_DISCOUNTPRICE,
    payload,
  };
};

const onMinusTotalPrice = (payload) => {
  return {
    type: actionTypes.MINUS_TOTALPRICE,
    payload,
  };
};

const onMinusDiscountPrice = (payload) => {
  return {
    type: actionTypes.MINUS_DISCOUNTPRICE,
    payload,
  };
};

const onClearTotalPrice = () => {
  return {
    type: actionTypes.CLEAR_TOTALPRICE,
  };
};

const onClearDeliveryDay = () => {
  return {
    type: actionTypes.CLEAR_DELIVERYDAY,
  };
};

const onClearDiscountPrice = () => {
  return {
    type: actionTypes.CLEAR_DISCOUNTPRICE,
  };
};

const onSaveUserData = (payload) => {
  return {
    type: actionTypes.SAVE_USER_DATA,
    payload,
  };
};

const onSaveSubCategory = (payload) => {
  return {
    type: actionTypes.SET_SUBCATEGORY,
    payload,
  };
};

const onSaveProfile = (payload) => {
  return {
    type: actionTypes.SAVE_PROFILE,
    payload,
  };
};

const onSaveCatalogues = (payload) => {
  return {
    type: actionTypes.SAVE_CATALOGUES,
    payload,
  };
};

const onSaveSubCategories = (payload) => {
  return {
    type: actionTypes.SAVE_SUBCATEGORIES,
    payload,
  };
};

const onSaveProducts = (payload) => {
  return {
    type: actionTypes.SAVE_PRODUCTS,
    payload,
  };
};

const onSavePhone = (payload) => {
  return {
    type: actionTypes.SAVE_PHONE,
    payload,
  };
};

const onSaveTotalPrice = (payload) => {
  return {
    type: actionTypes.SAVE_TOTALPRICE,
    payload,
  };
};

const onSaveDiscountPrice = (payload) => {
  return {
    type: actionTypes.SAVE_DISCOUNTPRICE,
    payload,
  };
};

const onSetLoadingTrue = () => {
  return {
    type: actionTypes.SET_LOADING_TRUE,
  };
};

const onSetLoadingFalse = () => {
  return {
    type: actionTypes.SET_LOADING_FALSE,
  };
};

const onSetGuestTrue = () => {
  return {
    type: actionTypes.SET_GUEST_TRUE,
  };
};

const onSetGuestFalse = () => {
  return {
    type: actionTypes.SET_GUEST_FALSE,
  };
};
const onSetPaymentTrue = () => {
  return {
    type: actionTypes.SET_PAYMENT_TRUE,
  };
};

const onSetPaymentFalse = () => {
  return {
    type: actionTypes.SET_PAYMENT_FALSE,
  };
};

const onSaveOrders = (payload) => {
  return {
    type: actionTypes.SAVE_ORDERS,
    payload,
  };
};

const onSetWelcome = (payload) => {
  return {
    type: actionTypes.SET_WELCOME,
    payload,
  };
};

const onSetDeliveryDay = (payload) => {
  return {
    type: actionTypes.SET_DELIVERYDAY,
    payload,
  };
};

export const saveCatalogues = (data, callback) => (dispatch) => {
  dispatch(onSaveCatalogues(data));
  callback();
};

export const login = (loginCredential, callback) => (dispatch) => {
  dispatch(onLoginStart());

  UserServices.login(loginCredential)
    .then((response) => {
      if (response.data.success === 1) {
        const payload = {
          ...response.data.data,
          token: response.data.token,
        };
        dispatch(onLoginSuccess(payload));
      } else {
        dispatch(onLoginError(response.data.msg));
      }
      callback(response.data);
    })
    .catch((error) => {
      dispatch(onLoginError(error.response));
      callback(error.response);
    });
};

export const logout = (callback) => (dispatch) => {
  dispatch(onLogoutStart());

  UserServices.logout()
    .then((response) => {
      if (response.data.success === 1) {
        dispatch(onLogoutSuccess());
      } else {
        dispatch(onLogoutError(response.data.msg));
      }
      callback(response.data);
    })
    .catch((error) => {
      dispatch(onLogoutError(error.response));
      callback(error.response);
    });
};

export const register = (body, callback) => (dispatch) => {
  dispatch(onRegisterStart());

  UserServices.register(body)
    .then((response) => {
      if (response.data.success === 1) {
        dispatch(onRegisterSuccess());
      } else {
        dispatch(onRegisterError(response.data.msg));
      }
      callback(response.data);
    })
    .catch((error) => {
      dispatch(onRegisterError(error.response));
      callback(error.response);
    });
};

export const saveProfileImage = (profile_image, callback) => (dispatch) => {
  dispatch(onProfileImage(profile_image));
};

export const updateName = (name, callback) => (dispatch) => {
  dispatch(onUpdateName(name));
};

export const registerNewAddress = (address) => (dispatch) => {
  dispatch(onRegisterNewAddress(address));
};

export const setActiveAddress = (address) => (dispatch) => {
  dispatch(onSetActiveAddress(address));
};

export const setPartner = (partner) => (dispatch) => {
  dispatch(onSetPartner(partner));
};

export const clearPartner = () => (dispatch) => {
  dispatch(onClearPartner());
};

export const setCategory = (category) => (dispatch) => {
  dispatch(onSetCategory(category));
};

export const clearCategory = () => (dispatch) => {
  dispatch(onClearCategory());
};

export const saveCategories = (categories) => (dispatch) => {
  dispatch(onSaveCategories(categories));
};

export const clearCategories = () => (dispatch) => {
  dispatch(onClearCategories());
};

export const clearSubCategory = () => (dispatch) => {
  dispatch(onClearSubCategory());
};

export const setCart = (cart) => (dispatch) => {
  dispatch(onSetCart(cart));
};

export const clearCart = () => (dispatch) => {
  dispatch(onClearCart());
};

export const addToCart = (product) => (dispatch) => {
  dispatch(onAddToCart(product));
};

export const addTotalPrice = (price) => (dispatch) => {
  dispatch(onAddTotalPrice(price));
};

export const addDiscountPrice = (price) => (dispatch) => {
  dispatch(onAddDiscountPrice(price));
};

export const minusTotalPrice = (price) => (dispatch) => {
  dispatch(onMinusTotalPrice(price));
};

export const minusDiscountPrice = (price) => (dispatch) => {
  dispatch(onMinusDiscountPrice(price));
};

export const clearTotalPrice = () => (dispatch) => {
  dispatch(onClearTotalPrice());
};

export const clearDiscountPrice = () => (dispatch) => {
  dispatch(onClearDiscountPrice());
};

export const saveUserData = (data) => (dispatch) => {
  dispatch(onSaveUserData(data));
};

export const saveSubCategory = (data) => (dispatch) => {
  dispatch(onSaveSubCategory(data));
};

export const saveAddresses = (data) => (dispatch) => {
  dispatch(onSaveAddresses(data));
};

export const saveProfile = (data) => (dispatch) => {
  dispatch(onSaveProfile(data));
};

export const saveSubCategories = (data) => (dispatch) => {
  dispatch(onSaveSubCategories(data));
};

export const saveProducts = (data) => (dispatch) => {
  dispatch(onSaveProducts(data));
};

export const savePhone = (data) => (dispatch) => {
  dispatch(onSavePhone(data));
};

export const saveTotalPrice = (data) => (dispatch) => {
  dispatch(onSaveTotalPrice(data));
};

export const saveDiscountPrice = (data) => (dispatch) => {
  dispatch(onSaveDiscountPrice(data));
};

export const setLoadingTrue = () => (dispatch) => {
  dispatch(onSetLoadingTrue());
};

export const setLoadingFalse = () => (dispatch) => {
  dispatch(onSetLoadingFalse());
};

export const setGuestTrue = () => (dispatch) => {
  dispatch(onSetGuestTrue());
};

export const setGuestFalse = () => (dispatch) => {
  dispatch(onSetGuestFalse());
};

export const setPaymentTrue = () => (dispatch) => {
  dispatch(onSetPaymentTrue());
};

export const setPaymentFalse = () => (dispatch) => {
  dispatch(onSetPaymentFalse());
};

export const saveOrders = (data) => (dispatch) => {
  dispatch(onSaveOrders(data));
};

export const setWelcome = (data) => (dispatch) => {
  dispatch(onSetWelcome(data));
};

export const setDeliveryDay = (data) => (dispatch) => {
  dispatch(onSetDeliveryDay(data));
};

export const clearDeliveryDay = () => (dispatch) => {
  dispatch(onClearDeliveryDay());
};
