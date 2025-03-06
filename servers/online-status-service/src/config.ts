import { config as dotenvConfig } from 'dotenv';
dotenvConfig({});

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
