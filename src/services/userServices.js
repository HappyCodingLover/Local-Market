import axios from 'axios';
import { BackendConfiguration } from '@config';
import LocalStorageService from '../services/localStorageService';
import { useNavigation } from '@react-navigation/native';
const localStorageService = LocalStorageService.getService();
const apiClient_json = axios.create({
  baseURL: BackendConfiguration.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

function login(body) {
  return apiClient_json.post('/users/login_with_phone', body);
}

function logout() {
  return apiClient_json.post('/users/logout');
}

function refresh(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.post('/users/refresh');
}

function addAddress(body, token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.post('/users/address', body);
}

function editAddress(body, token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.put('/users/address', body);
}

function getAddress(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.get('/users/address');
}

function saveProfile(body, token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.put('/users/profile', body);
}

function getProfile(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.get('/users/profile');
}

function checkCodeUsed(body, token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer' + token;
  return apiClient_json.post('/users/checkcodeused', body);
}

function addOrder(body, token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer' + token;
  return apiClient_json.post('/users/order', body);
}

function getOrder(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer' + token;
  return apiClient_json.get('/users/order');
}

function getOrderById(token, id) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.get('/users/order/' + id);
}

function getCart(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.get('/users/cart');
}

function addToCart(token, body) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.post('/users/cart', body);
}

function clearCart(token, id) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.delete('/users/cart/' + id);
}


export const UserServices = {
  login,
  logout,
  refresh,
  addAddress,
  editAddress,
  getAddress,
  saveProfile,
  getProfile,
  addOrder,
  checkCodeUsed,
  getOrder,
  getOrderById,
  getCart,
  clearCart,
  addToCart,
};
