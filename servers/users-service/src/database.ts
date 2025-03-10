import { config } from '@user/config';
import { SERVICE_NAME } from '@user/constants';
import { log } from '@user/utils/logger.util';
import mongoose from 'mongoose';

export class Database {
  public async connection() {
    try {
      await mongoose.connect(`${config.DATABASE_URL}`, {
        serverSelectionTimeoutMS: 5000
      });
      log.info(SERVICE_NAME + ' MongoDB database connection has been established successfully');
    } catch (error) {
      log.error(SERVICE_NAME + ' unable to connect to db');
      process.exit(1);
    }
  }
}

export const database = new Database();
