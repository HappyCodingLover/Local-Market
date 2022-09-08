// import * as actionTypes from '@actions/actionTypes';
import * as actionTypes from '../actions/actionTypes';
const initialState = {
  login: {
    isLoading: false,
    success: false,
    error: null,
  },
  register: {
    isLoading: false,
    success: false,
    error: null,
  },
  // user: {
  //   lang: 'en',
  // },
  user: null,
  addresses: [],
  partner: null,
  category: null,
  categories: [],
  subCategory: null,
  cart: [],
  totalPrice: 0,
  discountPrice: 0,
  profile: null,
  catalogues: [],
  subCategories: [],
  products: [],
  activeAddress: undefined,
  phone: '',
  _loading: false,
  isGuest: false,
  orders: [],
  welcomeSeen: false,
  payment: false,
  deliveryDay: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.REGISTER_ADDRESS:
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };
    case actionTypes.SAVE_ADDRESS:
      return {
        ...state,
        addresses: action.payload,
      };
    case actionTypes.SET_WELCOME:
      return {
        ...state,
        welcomeSeen: action.payload,
      };
    case actionTypes.SET_ACTIVE_ADDRESS:
      return {
        ...state,
        activeAddress: action.payload,
      };
    case actionTypes.SET_PARTNER:
      return {
        ...state,
        partner: action.payload,
      };
    case actionTypes.CLEAR_PARTNER:
      return {
        ...state,
        partner: {
          id: null,
          parent_id: null,
          name: null,
          inn: null,
          entity: null,
          description:
          null,
          logo_url:
          null,
          mainimage_url:
          null,
          status: null,
          request_comment: null,
          declined_reason: null,
          declined_images: null,
          updated_at: null,
          priority: null,
          working_days: [],
          working_starts_at: null,
          working_ends_at: null,
          break_times: [],
          timeframes: [
            {
              working_days: [],
              working_starts_at: null,
              working_ends_at: null,
              break_times: [],
            },
          ],
          delivery_zones: [
            {
              id: null,
              parent_id: null,
              district_id: null,
              delivery_timeframes: [
                {
                  start: null,
                  end: null,
                },
                {
                  start: null,
                  end: null,
                },
              ],
              delivery_price: null,
              free_delivery_from: null,
              min_order_price: null,
              status: null,
              request_comment: null,
              declined_reason: null,
              declined_images: null,
              updated_at: null,
              district: null,
            }
          ],
          min_order_price: null,
          address: null,
          legal_address: null,
          delivery_time_information:
          null,
          delivery_cost_information:
          null,
          promo_information:
          null,
          income: null,
          blocked: null,
          promocode: {
            id: null,
            discount: null,
            code: null,
          },
        },
      };
    case actionTypes.SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case actionTypes.CLEAR_CATEGORY:
      return {
        ...state,
        category: null,
      };
    case actionTypes.SAVE_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case actionTypes.CLEAR_CATEGORIES:
      return {
        ...state,
        categories: [],
      };
    case actionTypes.SET_SUBCATEGORY:
      return {
        ...state,
        subCategory: action.payload,
      };
    case actionTypes.CLEAR_SUBCATEGORY:
      return {
        ...state,
        subCategory: null,
      };
    case actionTypes.ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case actionTypes.SET_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        cart: [],
        deliveryDay: null,
      };
    case actionTypes.ADD_TOTALPRICE:
      return {
        ...state,
        totalPrice: parseFloat((state.totalPrice + action.payload).toFixed(2)),
      };
    case actionTypes.ADD_DISCOUNTPRICE:
      return {
        ...state,
        discountPrice: state.discountPrice + action.payload,
      };
    case actionTypes.MINUS_TOTALPRICE:
      return {
        ...state,
        totalPrice: parseFloat((state.totalPrice - action.payload).toFixed(2)),
      };
    case actionTypes.MINUS_DISCOUNTPRICE:
      return {
        ...state,
        discountPrice: state.discountPrice - action.payload,
      };
    case actionTypes.CLEAR_TOTALPRICE:
      return {
        ...state,
        totalPrice: 0,
      };
    case actionTypes.CLEAR_DELIVERYDAY:
      return {
        ...state,
        deliveryDay: null,
      };
    case actionTypes.CLEAR_DISCOUNTPRICE:
      return {
        ...state,
        discountPrice: 0,
      };
    case actionTypes.SAVE_TOTALPRICE:
      return {
        ...state,
        totalPrice: action.payload,
      };
    case actionTypes.SAVE_DISCOUNTPRICE:
      return {
        ...state,
        discountPrice: action.payload,
      };
    case actionTypes.SAVE_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.SAVE_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case actionTypes.SAVE_CATALOGUES:
      return {
        ...state,
        catalogues: action.payload,
      };
    case actionTypes.SAVE_SUBCATEGORIES:
      return {
        ...state,
        subCategories: action.payload,
      };
    case actionTypes.SAVE_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case actionTypes.SAVE_PHONE:
      return {
        ...state,
        phone: action.payload,
      };
    case actionTypes.SET_LOADING_TRUE:
      return {
        ...state,
        _loading: true,
      };
    case actionTypes.SET_DELIVERYDAY:
      return {
        ...state,
        deliveryDay: action.payload,
      };
    case actionTypes.SET_LOADING_FALSE:
      return {
        ...state,
        _loading: false,
      };
    case actionTypes.SET_GUEST_TRUE:
      return {
        ...state,
        isGuest: true,
      };
    case actionTypes.SET_GUEST_FALSE:
      return {
        ...state,
        isGuest: false,
      };
    case actionTypes.SET_PAYMENT_TRUE:
      return {
        ...state,
        payment: true,
      };
    case actionTypes.SET_PAYMENT_FALSE:
      return {
        ...state,
        payment: false,
      };
    case actionTypes.SAVE_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    case actionTypes.LOGIN_START:
      return {
        ...state,
        login: {
          ...state.login,
          isLoading: true,
          error: null,
        },
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        login: {
          ...state.login,
          isLoading: false,
          success: true,
        },
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        login: {
          ...state.login,
          isLoading: false,
          success: false,
          error: action.payload,
        },
      };
    case actionTypes.LOGOUT_START:
      return {
        ...state,
        login: {
          ...state.login,
          isLoading: true,
          error: null,
        },
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        login: {
          isLoading: false,
          success: false,
          error: null,
        },
        user: initialState.user,
      };
    case actionTypes.LOGOUT_ERROR:
      return {
        ...state,
        login: {
          ...state.login,
          isLoading: false,
          error: action.payload,
        },
      };
    case actionTypes.SAVE_PROFILE_IMAGE:
      return {
        ...state,
        user: {
          ...state.user,
          profileimg: action.payload,
        },
      };
    case actionTypes.SAVE_PROFILE_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload,
        },
      };
    default:
      return state;
  }
};
