import { auth } from '@/auth';
import axiosInstance from '@/lib/axios';

const HomePage = async () => {
  const session = await auth();
  if (session?.user?.accessToken) {
    const { data } = await axiosInstance.get('/auth/me');
    return <div className="w-full break-words">{JSON.stringify(data.user)}</div>;
  }
  return <div></div>;
};

export default HomePage;
