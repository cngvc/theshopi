import { config } from '@auth/config';
import { SERVICE_NAME } from '@auth/constants';
import { captureError, log } from '@auth/utils/logger.util';
import { IAuthDocument } from '@cngvc/shopi-shared';
import { DataSource } from 'typeorm';
import { AuthModel } from './entities/auth.entity';

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
      await this.createDefaultAdmin();
      log.info(SERVICE_NAME + ' Mysql database connection has been established successfully');
    } catch (error) {
      captureError(error, 'connection');
    }
  }

  private async createDefaultAdmin() {
    const authRepository = AppDataSource.getRepository(AuthModel);
    const existingUser = await authRepository.count();

    if (existingUser === 0) {
      const adminUser = authRepository.create({
        username: 'admin',
        email: 'admin@shopi.com',
        password: 'Asdfgh123',
        role: 'admin'
      } as IAuthDocument);
      await authRepository.save(adminUser);
      log.info('✅ Default admin user has been created successfully');
    } else {
      log.info('✅ Admin user already exists, skipping creation');
    }
  }
}

export const database = new Database();
