import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Sun, Moon, LogOut } from 'lucide-react';
import type { Friend } from '../../types';

interface ChatHeaderProps {
  activeChat: Friend | null;
  isDark: boolean;
  isInCall: boolean;
  setIsInCall: (inCall: boolean) => void;
  toggleTheme: () => void;
}

const ChatHeader = ({
  activeChat,
  isDark,
  isInCall,
  setIsInCall,
  toggleTheme,
}: ChatHeaderProps) => (
  <div className="flex justify-between items-center p-4 border-b">
    <div className="flex items-center gap-2">
      {activeChat && (
        <>
          <Avatar>
            <AvatarImage src={activeChat.avatar} />
            <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{activeChat.name}</p>
            {activeChat.online && (
              <p className="text-sm text-green-500">Online</p>
            )}
          </div>
        </>
      )}
    </div>
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsInCall(!isInCall)}
      >
        <Phone className={isInCall ? "text-green-500" : ""} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleTheme}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
      >
        <LogOut />
      </Button>
    </div>
  </div>
);

export default ChatHeader;