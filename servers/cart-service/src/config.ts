import { config as dotenvConfig } from 'dotenv';
dotenvConfig({});

class Config {
  public API_GATEWAY_URL: string | undefined;
  public AUTH_JWT_TOKEN_SECRET: string | undefined;
  public CLIENT_URL: string | undefined;
  public DATABASE_URL: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public GATEWAY_JWT_TOKEN_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;

  constructor() {
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.AUTH_JWT_TOKEN_SECRET = process.env.AUTH_JWT_TOKEN_SECRET || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.GATEWAY_JWT_TOKEN_SECRET = process.env.GATEWAY_JWT_TOKEN_SECRET || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
  }
}

export const config: Config = new Config();
