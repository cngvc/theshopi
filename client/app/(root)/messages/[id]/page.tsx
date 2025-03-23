import ConversationList from './components/conversation-list';
import MessageBox from './components/message-box';

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const { id: conversationPublicId } = await props.params;
  return (
    <div className="flex-1 gap-4 grid md:grid-cols-[320px_1fr]">
      <ConversationList />
      <MessageBox conversationPublicId={conversationPublicId} />
    </div>
  );
};

export default Page;
