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
  public ELASTIC_SEARCH_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public REDIS_HOST: string | undefined;
  public SOCKET_BASE_URL: string | undefined;

  constructor() {
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.SOCKET_BASE_URL = process.env.SOCKET_BASE_URL || '';
  }
}

export const config: Config = new Config();
