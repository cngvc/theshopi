import dotenv from 'dotenv';
import { SERVICE_NAME } from './constants';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  require('elastic-apm-node').start({
    serviceName: SERVICE_NAME,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    environment: process.env.NODE_ENV,
    active: true,
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always'
  });
}

class Config {
  public AUTH_BASE_URL: string | undefined;
  public AUTH_JWT_TOKEN_SECRET: string | undefined;
  public CLIENT_URL: string | undefined;
  public CHAT_BASE_URL: string | undefined;
  public COOKIE_SECRET_KEY_FIRST: string | undefined;
  public COOKIE_SECRET_KEY_SECOND: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public GATEWAY_JWT_TOKEN_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public USERS_BASE_URL: string | undefined;
  public PRODUCTS_BASE_URL: string | undefined;
  public ONLINE_STATUS_BASE_URL: string | undefined;
  public SOCKET_BASE_URL: string | undefined;
  public CART_BASE_URL: string | undefined;
  public ORDER_BASE_URL: string | undefined;
  public AUTH_BASE_URL_GRPC: string | undefined;

  constructor() {
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    this.AUTH_JWT_TOKEN_SECRET = process.env.AUTH_JWT_TOKEN_SECRET || '';
    this.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
    this.CHAT_BASE_URL = process.env.CHAT_BASE_URL || '';
    this.COOKIE_SECRET_KEY_FIRST = process.env.COOKIE_SECRET_KEY_FIRST || '*';
    this.COOKIE_SECRET_KEY_SECOND = process.env.COOKIE_SECRET_KEY_SECOND || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.GATEWAY_JWT_TOKEN_SECRET = process.env.GATEWAY_JWT_TOKEN_SECRET || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    this.PRODUCTS_BASE_URL = process.env.PRODUCTS_BASE_URL || '';
    this.ONLINE_STATUS_BASE_URL = process.env.ONLINE_STATUS_BASE_URL || '';
    this.SOCKET_BASE_URL = process.env.SOCKET_BASE_URL || '';
    this.CART_BASE_URL = process.env.CART_BASE_URL || '';
    this.ORDER_BASE_URL = process.env.ORDER_BASE_URL || '';
    this.AUTH_BASE_URL_GRPC = process.env.AUTH_BASE_URL_GRPC || '';
  }
}

export const config: Config = new Config();
