import { AppDataSource } from '@auth/database';
import { UserProviderModel } from '@auth/entities/user-provider.entity';
import { IUserProviderDocument } from '@cngvc/shopi-shared';
import { Repository } from 'typeorm';

class UserProviderService {
  private userProviderRepository: Repository<UserProviderModel>;
  constructor() {
    this.userProviderRepository = AppDataSource.getRepository(UserProviderModel);
  }

  findUserProvider = async (params: Partial<IUserProviderDocument>): Promise<IUserProviderDocument | null> => {
    return await this.userProviderRepository.findOne({ where: params });
  };

  createUserProvider = async (payload: IUserProviderDocument) => {
    let userProvider = this.userProviderRepository.create(payload);
    userProvider = await userProvider.save();
    return userProvider;
  };
}

export const userProviderService = new UserProviderService();
