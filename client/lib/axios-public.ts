'use server';

import axios from 'axios';
import { GATEWAY_URL } from './configs';

const axiosPublicInstance = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true
});

export default axiosPublicInstance;
