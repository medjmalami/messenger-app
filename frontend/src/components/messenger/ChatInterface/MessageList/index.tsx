import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => (
  <ScrollArea className="flex-1 p-4">
    <div className="space-y-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <p>{message.content}</p>
            <span className="text-xs opacity-70">{message.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
);

export default MessageList;