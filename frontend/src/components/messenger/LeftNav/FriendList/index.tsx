import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import type { Friend } from '../../types';

interface FriendListProps {
  friends: Friend[];
}

const FriendList = ({ friends }: FriendListProps) => (
  <ScrollArea className="h-[calc(100vh-10rem)]">
    {friends.map(friend => (
      <div key={friend.id} className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={friend.avatar} />
          <AvatarFallback>{friend.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{friend.name}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </ScrollArea>
);

export default FriendList;