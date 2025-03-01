import { getErrorMessage } from '@cngvc/shopi-shared';
import { config } from '@products/config';
import { SERVICE_NAME } from '@products/constants';
import { log } from '@products/utils/logger.util';
import mongoose from 'mongoose';

export class Database {
  public async connection() {
    try {
      await mongoose.connect(`${config.DATABASE_URL}`);
      log.info(SERVICE_NAME + ' MongoDB database connection has been established successfully');
    } catch (error) {
      log.error(SERVICE_NAME + ' unable to connect to db');
      log.log('error', SERVICE_NAME + ` connection() method:`, getErrorMessage(error));
    }
  }
}

export const database = new Database();
