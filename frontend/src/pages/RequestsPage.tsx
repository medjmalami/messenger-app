import { useState } from 'react';
import LeftNav from '../components/messenger/LeftNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { FriendRequest } from '../components/messenger/types';

const RequestsPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [requests] = useState<FriendRequest[]>([
    { id: 1, name: "Alice Cooper", avatar: "/api/placeholder/32/32" },
    { id: 2, name: "Bob Wilson", avatar: "/api/placeholder/32/32" }
  ]);

  return (
    <div className={`h-screen ${isDark ? 'dark' : ''}`}>
      <div className="h-screen flex bg-background">
        <LeftNav 
          activeTab="requests"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          requests={requests}
        />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Friend Requests</h1>
          <div className="space-y-2">
            {requests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback>{request.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{request.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="default">Accept</Button>
                  <Button variant="outline">Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;