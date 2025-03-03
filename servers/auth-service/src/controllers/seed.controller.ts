import { SERVICE_NAME } from '@auth/constants';
import { authService } from '@auth/services/auth.service';
import { generateRandomCharacters } from '@auth/utils/generate.util';
import { log } from '@auth/utils/logger.util';
import { IAuthDocument, lowerCase } from '@cngvc/shopi-shared';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sample } from 'lodash';
import { generateUsername } from 'unique-username-generator';

class SeedController {
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
        console.log(`***Seeding auth:*** - ${i + 1} of ${usernames.length}`);
        await authService.createAuthUser(authData);
      } else {
        log.info(SERVICE_NAME + ` createSeeds() method:`, `${existingUser.username} existed`);
      }
    }
    res.status(StatusCodes.OK).json({ message: 'Seed users created successfully.' });
  }
}

export const seedController = new SeedController();
