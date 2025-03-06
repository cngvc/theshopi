import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared-types';

const Message = ({ message }: { message: IMessageDocument }) => {
  return (
    <div className="py-2 border-b">
      <p className="font-medium">{message.senderUsername}</p>
      <Tooltip>
        <TooltipTrigger className="text-sm text-gray-500">{message.body}</TooltipTrigger>
        <TooltipContent side="left">
          <p>{formatDate(`${message.createdAt}`)}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Message;
