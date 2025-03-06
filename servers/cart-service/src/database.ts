import { config } from '@cart/config';
import { SERVICE_NAME } from '@cart/constants';
import { log } from '@cart/utils/logger.util';
import mongoose from 'mongoose';

export class Database {
  public async connection() {
    try {
      await mongoose.connect(`${config.DATABASE_URL}`);
      log.info(SERVICE_NAME + ' MongoDB database connection has been established successfully');
    } catch (error) {
      log.error(SERVICE_NAME + ' unable to connect to db');
    }
  }
}

export const database = new Database();
