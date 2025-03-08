import { SERVICE_NAME } from '@cart/constants';
import { createLogger } from '@cngvc/shopi-shared';

export const { log, logCatch } = createLogger(SERVICE_NAME, `${process.env.ELASTIC_SEARCH_URL}`);
