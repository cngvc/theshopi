import { createLogger } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@gateway/constants';

export const { log, captureError } = createLogger(SERVICE_NAME, `${process.env.ELASTIC_SEARCH_URL}`);
