'use server';

import { auth } from '@/auth';
import axios from 'axios';
import { GATEWAY_URL } from './configs';

const axiosPrivateInstance = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true
});

axiosPrivateInstance.interceptors.request.use(async (request) => {
  const session = await auth();
  if (session?.accessToken) {
    request.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return request;
});

export default axiosPrivateInstance;
