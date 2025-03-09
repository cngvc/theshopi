import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared-types';

const MessageItem = ({ message }: { message: IMessageDocument }) => {
  const name = (message.counterpartName || message.messagePublicId || '-') as string;
  return (
    <div className="py-2 border-b grid grid-cols-[48px_1fr] gap-2">
      <div className="flex items-start pt-1 justify-start">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={`User avatar ${name}`} />
          <AvatarFallback>{(name || '-')[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col flex-1 justify-center">
        <p className="font-medium">{name}</p>
        <div>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-sm text-gray-500 text-left">{message.body}</div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{formatDate(`${message.createdAt}`)}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
