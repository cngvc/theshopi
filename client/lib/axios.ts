import { auth } from '@/auth';
import axios from 'axios';
import { SERVER_URL } from './constants';

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
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
