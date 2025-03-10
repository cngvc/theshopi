import { createLogger } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@online-status/constants';

export const { log, captureError } = createLogger(SERVICE_NAME, `${process.env.ELASTIC_SEARCH_URL}`);
