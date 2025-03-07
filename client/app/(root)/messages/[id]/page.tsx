import { requireAuth } from '@/lib/auth-guard';
import ConversationList from './components/conversation-list';
import MessageBox from './components/message-box';

const Page = async (props: { params: Promise<{ id: string }> }) => {
  await requireAuth();
  const { id } = await props.params;
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 grid gap-4 md:grid-cols-6">
        <ConversationList />
        <MessageBox id={id} />
      </div>
    </div>
  );
};

export default Page;
