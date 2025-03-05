import { getErrorMessage, winstonLogger } from '@cngvc/shopi-shared';
import { config } from '@online-status/config';
import { SERVICE_NAME } from '@online-status/constants';
import { Logger } from 'winston';

const logger = (name: string, level: string) => {
  const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, name, level);
  return log;
};

export const log = logger(SERVICE_NAME, 'debug');

export const logCatch = (error: unknown, comingFrom: string) => log.log('error', `${SERVICE_NAME} ${comingFrom}`, getErrorMessage(error));
