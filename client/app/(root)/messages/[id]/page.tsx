import ConversationList from './components/conversation-list';
import MessageBox from './components/message-box';

const Page = () => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 grid gap-4 md:grid-cols-6">
        <ConversationList />
        <MessageBox />
      </div>
    </div>
  );
};

export default Page;
