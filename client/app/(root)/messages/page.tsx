import { getCurrentUserLastConversation } from '@/lib/actions/chat.action';
import pages from '@/lib/constants/pages';
import { redirect } from 'next/navigation';

const Page = async () => {
  const conversation = await getCurrentUserLastConversation();
  if (conversation?.conversationPublicId) {
    redirect(`${pages.messages}/${conversation?.conversationPublicId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="text-2xl font-semibold">There are no new message</div>
      <p className="text-gray-500 mt-2">No messages yet, start the conversation!</p>
    </div>
  );
};

export default Page;
