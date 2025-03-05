import { config as dotenvConfig } from 'dotenv';
dotenvConfig({});

class Config {
  public CLIENT_URL: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public REDIS_HOST: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;

  constructor() {
    this.CLIENT_URL = '*'; // process.env.CLIENT_URL;
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
  }
}

export const config: Config = new Config();
