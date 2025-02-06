import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Friend } from '../../types';

interface ChatListProps {
  friends: Friend[];
  activeChat: Friend | null;
  setActiveChat: (friend: Friend) => void;
}

const ChatList = ({ friends, activeChat, setActiveChat }: ChatListProps) => (
  <ScrollArea className="h-[calc(100vh-10rem)]">
    {friends.map(friend => (
      <div
        key={friend.id}
        className={`p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
          activeChat?.id === friend.id ? 'bg-gray-100 dark:bg-gray-800' : ''
        }`}
        onClick={() => setActiveChat(friend)}
      >
        <div className="relative">
          <Avatar>
            <AvatarImage src={friend.avatar} />
            <AvatarFallback>{friend.name[0]}</AvatarFallback>
          </Avatar>
          {friend.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{friend.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {friend.lastMessage}
          </p>
        </div>
      </div>
    ))}
  </ScrollArea>
);

export default ChatList;