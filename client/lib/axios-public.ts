'use server';

import axios, { CreateAxiosDefaults } from 'axios';
import { GATEWAY_URL } from './configs';

const axiosPublicInstance = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
  id: 'public-instance'
} as CreateAxiosDefaults & { id: string });

axiosPublicInstance.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('➡️ Outgoing Request:', {
      url: config.baseURL,
      data: config.data
    });
  }
  return config;
});

export default axiosPublicInstance;
