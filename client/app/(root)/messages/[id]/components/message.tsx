import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared-types';

const Message = ({ message }: { message: IMessageDocument }) => {
  return (
    <div className="py-2 border-b flex">
      <div className="flex items-start pt-1 justify-start w-12">
        <Avatar>
          <AvatarImage src="" alt={`User avatar ${message.senderUsername}`} />
          <AvatarFallback>{message.senderUsername?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-medium">{message.senderUsername}</p>
        <div>
          <Tooltip>
            <TooltipTrigger className="text-sm text-gray-500">{message.body}</TooltipTrigger>
            <TooltipContent side="left">
              <p>{formatDate(`${message.createdAt}`)}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Message;
