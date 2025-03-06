import { useParams } from 'next/navigation';

export const useParamId = () => {
  const params = useParams();
  return params.id as string;
};
