import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Users, UserPlus2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Friend, FriendRequest } from '../types';

interface LeftNavProps {
  activeTab: 'chats' | 'friends' | 'requests';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  friends?: Friend[];
  requests?: FriendRequest[];
  activeChat?: Friend | null;
  setActiveChat?: (friend: Friend) => void;
}

const LeftNav = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  friends = [],
  requests = [],
  activeChat,
  setActiveChat
}: LeftNavProps) => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'chats':
        navigate('/chat');
        break;
      case 'friends':
        navigate('/friends');
        break;
      case 'requests':
        navigate('/requests');
        break;
    }
  };

  return (
    <div className="w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
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
          {friends.map(friend => (
            <div
              key={friend.id}
              className={`p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                activeChat?.id === friend.id ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
              onClick={() => setActiveChat?.(friend)}
            >
              <div className="flex-1">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {friend.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="friends" className="flex-1">
          {friends.map(friend => (
            <div key={friend.id} className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {friend.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="flex-1">
          {requests.map(request => (
            <div key={request.id} className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">{request.name}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftNav;