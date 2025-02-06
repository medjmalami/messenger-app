import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Users, UserPlus2 } from 'lucide-react';
import type { Friend, FriendRequest } from '../types';
import ChatList from './ChatList';
import FriendList from './FriendList';
import RequestList from './RequestList';

interface LeftNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  friends: Friend[];
  requests: FriendRequest[];
  activeChat: Friend | null;
  setActiveChat: (friend: Friend) => void;
}

const LeftNav = ({
  searchQuery,
  setSearchQuery,
  friends,
  requests,
  activeChat,
  setActiveChat
}: LeftNavProps) => (
  <div className="w-80 border-r h-full flex flex-col">
    <div className="p-4 border-b">
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search friends or messages..."
          className="w-full pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
    
    <Tabs defaultValue="chats" className="flex-1">
      <TabsList className="w-full justify-start p-2 gap-2">
        <TabsTrigger value="chats">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chats
        </TabsTrigger>
        <TabsTrigger value="friends">
          <Users className="h-4 w-4 mr-2" />
          Friends
        </TabsTrigger>
        <TabsTrigger value="requests">
          <UserPlus2 className="h-4 w-4 mr-2" />
          Requests
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chats" className="flex-1">
        <ChatList friends={friends} activeChat={activeChat} setActiveChat={setActiveChat} />
      </TabsContent>
      <TabsContent value="friends" className="flex-1">
        <FriendList friends={friends} />
      </TabsContent>
      <TabsContent value="requests" className="flex-1">
        <RequestList requests={requests} />
      </TabsContent>
    </Tabs>
  </div>
);

export default LeftNav;