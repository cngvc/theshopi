import { config } from '@auth/config';
import { SERVICE_NAME } from '@auth/constants';
import { captureError, log } from '@auth/utils/logger.util';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: config.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../**/migrations/*.{ts,js}'],
  extra: {
    multipleStatements: true
  }
});

export class Database {
  public async connection() {
    try {
      await AppDataSource.initialize();
      log.info(SERVICE_NAME + ' Mysql database connection has been established successfully');
    } catch (error) {
      captureError(error, 'connection');
    }
  }
}

export const database = new Database();
