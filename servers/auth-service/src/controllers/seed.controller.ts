import { authService } from '@auth/services/auth.service';
import { generateRandomCharacters } from '@auth/utils/generate.util';
import { BadRequestError, IAuthDocument, lowerCase } from '@cngvc/shopi-shared';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sample } from 'lodash';
import { generateUsername } from 'unique-username-generator';
import { v4 as uuidV4 } from 'uuid';

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
      const email = faker.internet.email({ firstName: 'Joe', lastName: 'Vu' });
      const password = 'Asdfgh123';
      const profilePicture = faker.image.urlPicsumPhotos();
      const existingUser = await authService.getAuthUserByUsernameOrEmail(username, email);
      if (existingUser) {
        throw new BadRequestError('Invalid credentials', 'Seed create() method');
      }
      const profilePublicId = uuidV4();
      const randomCharacters = await generateRandomCharacters();
      const authData: IAuthDocument = {
        username: lowerCase(username),
        email: lowerCase(email),
        profilePublicId,
        password,
        profilePicture,
        emailVerificationToken: randomCharacters,
        emailVerified: sample([false, true])
      } as IAuthDocument;
      await authService.createAuthUser(authData);
    }
    res.status(StatusCodes.OK).json({ message: 'Seed users created successfully.' });
  }
}

export const seedController = new SeedController();
