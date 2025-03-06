import { getLatestConversation } from '@/lib/actions/chat.action';
import pages from '@/lib/constants/pages';
import { redirect } from 'next/navigation';

const Page = async () => {
  const conversation = await getLatestConversation();
  if (conversation?.conversationId) {
    redirect(`${pages.messages}/${conversation?.conversationId}`);
  }
  return <div>No Messages</div>;
};

export default Page;
