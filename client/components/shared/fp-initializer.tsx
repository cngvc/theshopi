'use client';

import useFingerprintInterceptor from '@/lib/hooks/use-fp.hook';

const FpInitializer = () => {
  useFingerprintInterceptor();
  return <div className="add-fp hidden"></div>;
};

export default FpInitializer;
