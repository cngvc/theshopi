import { config as dotenvConfig } from 'dotenv';
import apm from 'elastic-apm-node';
import { SERVICE_NAME } from './constants';
dotenvConfig({});

if (process.env.ENABLE_APM === '1' && !apm.isStarted()) {
  apm.start({
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
  public API_GATEWAY_URL: string | undefined;
  public AUTH_BASE_URL_GRPC: string | undefined;
  public CLIENT_URL: string | undefined;
  public DATABASE_URL: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public GATEWAY_JWT_TOKEN_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;

  constructor() {
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.AUTH_BASE_URL_GRPC = process.env.AUTH_BASE_URL_GRPC || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.GATEWAY_JWT_TOKEN_SECRET = process.env.GATEWAY_JWT_TOKEN_SECRET || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
  }
}

export const config: Config = new Config();
