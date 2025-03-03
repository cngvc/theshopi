import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public AUTH_BASE_URL: string | undefined;
  public AUTH_JWT_TOKEN_SECRET: string | undefined;
  public CLIENT_URL: string | undefined;
  public COOKIE_SECRET_KEY_FIRST: string | undefined;
  public COOKIE_SECRET_KEY_SECOND: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public GATEWAY_JWT_TOKEN_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public USERS_BASE_URL: string | undefined;
  public PRODUCTS_BASE_URL: string | undefined;

  constructor() {
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    this.AUTH_JWT_TOKEN_SECRET = process.env.AUTH_JWT_TOKEN_SECRET || '';
    this.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
    this.COOKIE_SECRET_KEY_FIRST = process.env.COOKIE_SECRET_KEY_FIRST || '*';
    this.COOKIE_SECRET_KEY_SECOND = process.env.COOKIE_SECRET_KEY_SECOND || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.GATEWAY_JWT_TOKEN_SECRET = process.env.GATEWAY_JWT_TOKEN_SECRET || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    this.PRODUCTS_BASE_URL = process.env.PRODUCTS_BASE_URL || '';
  }
}

export const config: Config = new Config();
