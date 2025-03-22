import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useEffect, useState } from 'react';

const useFingerprintInterceptor = () => {
  const [fingerprint, $fingerprint] = useState<string | null>(null);

  useEffect(() => {
    const fetchFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      $fingerprint(visitorId);
    };
    fetchFingerprint();
  }, []);

  return null;
};

export default useFingerprintInterceptor;
