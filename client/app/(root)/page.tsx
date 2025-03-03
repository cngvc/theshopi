import { auth } from '@/auth';
import { Button } from '@/components/ui/button';

const HomePage = async () => {
  const session = await auth();

  return (
    <div>
      <Button>HOME</Button>
    </div>
  );
};

export default HomePage;
