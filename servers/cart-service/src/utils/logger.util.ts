import { config } from '@cart/config';
import { SERVICE_NAME } from '@cart/constants';
import { getErrorMessage, winstonLogger } from '@cngvc/shopi-shared';
import { Logger } from 'winston';

const logger = (name: string, level: string) => {
  const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, name, level);
  return log;
};

export const log = logger(SERVICE_NAME, 'debug');

export const logCatch = (error: unknown, comingFrom: string) => log.log('error', `${SERVICE_NAME} ${comingFrom}`, getErrorMessage(error));
