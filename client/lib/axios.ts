import { auth } from '@/auth';
import axios from 'axios';
import { GATEWAY_URL } from './configs';

const axiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(async (request) => {
  const session = await auth();
  if (session?.user?.accessToken) {
    request.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return request;
});

export default axiosInstance;
