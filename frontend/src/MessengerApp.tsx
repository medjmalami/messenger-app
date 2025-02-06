import { useState } from 'react';
import AuthForm from '@/components/messenger/AuthForm';
import LeftNav from '@/components/messenger/LeftNav';
import ChatInterface from '@/components/messenger/ChatInterface';
import type { Message, Friend, FriendRequest } from '@/components/messenger/types';

const MessengerApp = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [activeChat, setActiveChat] = useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [messages] = useState<Message[]>([
    { id: 1, content: "Hey, how are you?", sender: "friend", timestamp: "10:30 AM" },
    { id: 2, content: "I'm good, thanks!", sender: "user", timestamp: "10:31 AM" }
  ]);

  const [friends] = useState<Friend[]>([
    { id: 1, name: "Jane Smith", avatar: "/api/placeholder/32/32", lastMessage: "See you tomorrow!", online: true },
    { id: 2, name: "John Doe", avatar: "/api/placeholder/32/32", lastMessage: "Thanks!", online: false }
  ]);

  const [requests] = useState<FriendRequest[]>([
    { id: 1, name: "Alice Cooper", avatar: "/api/placeholder/32/32" },
    { id: 2, name: "Bob Wilson", avatar: "/api/placeholder/32/32" }
  ]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`h-screen ${isDark ? 'dark' : ''}`}>
      {!isLoggedIn ? (
        <div className="h-screen flex items-center justify-center p-4 bg-background">
          <AuthForm 
            showSignUp={showSignUp} 
            setShowSignUp={setShowSignUp} 
            setIsLoggedIn={setIsLoggedIn} 
          />
        </div>
      ) : (
        <div className="h-screen flex bg-background">
          <LeftNav 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            friends={friends}
            requests={requests}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
          />
          <ChatInterface 
            activeChat={activeChat}
            messages={messages}
            isDark={isDark}
            isInCall={isInCall}
            setIsInCall={setIsInCall}
            toggleTheme={toggleTheme}
            setIsLoggedIn={setIsLoggedIn}
          />
        </div>
      )}
    </div>
  );
};

export default MessengerApp;