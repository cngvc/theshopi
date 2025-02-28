import { winstonLogger } from '@cngvc/shopi-shared';
import { config } from '@users/config';
import { Logger } from 'winston';

const logger = (name: string, level: string) => {
  const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, name, level);
  return log;
};

export const log = logger('userServer', 'debug');
