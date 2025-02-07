import { useState } from 'react';
import LeftNav from '../components/messenger/LeftNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import type { Friend } from '../components/messenger/types';

const FriendsPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [friends] = useState<Friend[]>([
    { id: 1, name: "Jane Smith", avatar: "/api/placeholder/32/32", lastMessage: "See you tomorrow!", online: true },
    { id: 2, name: "John Doe", avatar: "/api/placeholder/32/32", lastMessage: "Thanks!", online: false }
  ]);

  return (
    <div className={`h-screen ${isDark ? 'dark' : ''}`}>
      <div className="h-screen flex bg-background">
        <LeftNav 
          activeTab="friends"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          friends={friends}
        />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Friends</h1>
          <div className="space-y-2">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {friend.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;