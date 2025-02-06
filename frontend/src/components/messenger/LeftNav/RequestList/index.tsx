import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import type { FriendRequest } from '../../types';

interface RequestListProps {
  requests: FriendRequest[];
}

const RequestList = ({ requests }: RequestListProps) => (
  <ScrollArea className="h-[calc(100vh-10rem)]">
    {requests.map(request => (
      <div key={request.id} className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={request.avatar} />
          <AvatarFallback>{request.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{request.name}</p>
        </div>
        <Button size="sm">Accept</Button>
      </div>
    ))}
    <div className="p-4 border-t">
      <Button className="w-full" variant="outline">
        <UserPlus className="h-4 w-4 mr-2" />
        Send Friend Request
      </Button>
    </div>
  </ScrollArea>
);

export default RequestList;