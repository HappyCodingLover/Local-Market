import axios from 'axios';
import { BackendConfiguration } from '@config';

const apiClient_json = axios.create({
  baseURL: BackendConfiguration.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const dadataClient_json = axios.create({
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest',
  url: '/address',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Token' + '60d2678d4b84bf022b27ee643f49d1b1f86290b8',
    // 'Authorization': '60d2678d4b84bf022b27ee643f49d1b1f86290b8',
  },
  data: {
    query: 'moscow khabar',
  },
  // data: 'query=moscow',
  timeout: 30000,
});

function getAllPartners(category_ids, district) {
  if (category_ids !== undefined) {
    return apiClient_json.get(
      `/partners/allforguest?page=1&category_ids=[${category_ids}]` + '&district=' + district,
    );
  } else {
    return apiClient_json.get(
      `/partners/allforguest?page=1` + '&district=' + district,
    );
  }
  
}

function getCatalogues(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer' + token;
  return apiClient_json.get('/partners/all?page=1');
}

function getCatalogueById(id) {
  return apiClient_json.get('/partners/' + id);
}

function getPartnersByCategory(token, ids) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer' + token;
  return apiClient_json.get(`/partners/all?category_ids=[${ids}]`);
}

function getSubCatalogues(id) {
  return apiClient_json.get('/partners/' + id + '/subcategories');
}

function getProducts(id) {
  return apiClient_json.get('/partners/' + id);
}

function getArticles() {
  return apiClient_json.get('/articles');
}

function getDocuments() {
  return apiClient_json.get('/documents');
}

function getCategories() {
  return apiClient_json.get('/product/categories');
}

function logout(token) {
  apiClient_json.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return apiClient_json.post('/users/logout');
}

function autoSuggestion(query) {
  return dadataClient_json.post();
}

function checkIfPhoneNumberExists(phoneNumber) {
  const body = { phone: phoneNumber };
  return apiClient_json.post('/users/checkPhoneValid', body);
}

export const GuestServices = {
  getAllPartners,
  getCatalogues,
  getSubCatalogues,
  getProducts,
  logout,
  autoSuggestion,
  getArticles,
  getDocuments,
  getCategories,
  getPartnersByCategory,
  getCatalogueById,
  checkIfPhoneNumberExists,
};
