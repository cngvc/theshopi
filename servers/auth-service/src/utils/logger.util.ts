import { SERVICE_NAME } from '@auth/constants';
import { createLogger } from '@cngvc/shopi-shared';

export const { log, captureError } = createLogger(SERVICE_NAME, `${process.env.ELASTIC_SEARCH_URL}`);
