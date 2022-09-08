import axios from 'axios';
import { BackendConfiguration } from '@config';

const apiClient_json = axios.create({
  baseURL: 'https://securepay.tinkoff.ru/v2/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

function _init(body) {
    return apiClient_json.post('/Init', body);
}

export const TinkoffServices = {
    _init,
};
