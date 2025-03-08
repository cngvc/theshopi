import { createLogger } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@orders/constants';

export const { log, logCatch } = createLogger(SERVICE_NAME, `${process.env.ELASTIC_SEARCH_URL}`);
