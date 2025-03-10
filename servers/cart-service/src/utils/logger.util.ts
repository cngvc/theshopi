import { SERVICE_NAME } from '@cart/constants';
import { createLogger } from '@cngvc/shopi-shared';

export const { log, captureError } = createLogger(SERVICE_NAME, `${process.env.ELASTIC_SEARCH_URL}`);
