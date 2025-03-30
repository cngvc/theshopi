import { SERVICE_NAME } from '@auth/constants';
import { authService } from '@auth/services/auth.service';
import { generateRandomCharacters } from '@auth/utils/generate.util';
import { log } from '@auth/utils/logger.util';
import { IAuthDocument, lowerCase, OkRequestSuccess } from '@cngvc/shopi-shared';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { sample } from 'lodash';
import { generateUsername } from 'unique-username-generator';

class AuthSeedController {
  async createSeeds(req: Request, res: Response): Promise<void> {
    const { count } = req.params;
    const usernames: string[] = [];
    for (let i = 0; i < parseInt(count, 10); i++) {
      const username: string = generateUsername('', 0, 12);
      usernames.push(lowerCase(username));
    }
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      const email = faker.internet.email();
      const password = 'Asdfgh123';
      const existingUser = await authService.getAuthUserByUsernameOrEmail(username, email);
      if (!existingUser) {
        const randomCharacters = await generateRandomCharacters();
        const authData: IAuthDocument = {
          username: lowerCase(username),
          email: lowerCase(email),
          password,
          emailVerificationToken: randomCharacters,
          emailVerified: sample([false, true])
        } as IAuthDocument;
        log.info(`***Seeding auth:*** - ${i + 1} of ${usernames.length}`);
        await authService.createAuthUser(authData);
      } else {
        log.info(SERVICE_NAME + ` createSeeds() method:`, `${existingUser.username} existed`);
      }
    }
    new OkRequestSuccess('Seed users created successfully.', {}).send(res);
  }
}

export const authSeedController = new AuthSeedController();
