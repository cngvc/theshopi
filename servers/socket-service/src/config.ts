import { config as dotenvConfig } from 'dotenv';
dotenvConfig({});

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
