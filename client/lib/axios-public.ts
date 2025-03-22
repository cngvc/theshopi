'use server';

import axios, { CreateAxiosDefaults } from 'axios';
import { GATEWAY_URL } from './configs';

const axiosPublicInstance = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
  id: 'public-instance'
} as CreateAxiosDefaults & { id: string });

export default axiosPublicInstance;
