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
  public ONLINE_STATUS_BASE_URL: string | undefined;
  public CHAT_BASE_URL: string | undefined;
  public GATEWAY_URL: string | undefined;

  constructor() {
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.ONLINE_STATUS_BASE_URL = process.env.ONLINE_STATUS_BASE_URL || '';
    this.CHAT_BASE_URL = process.env.CHAT_BASE_URL || '';
    this.GATEWAY_URL = process.env.GATEWAY_URL || '';
  }
}

export const config: Config = new Config();
