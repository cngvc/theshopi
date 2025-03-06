import { auth } from '@/auth';

const Page = async () => {
  const session = await auth();

  return <div></div>;
};

export default Page;
