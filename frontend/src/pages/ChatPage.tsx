import { useState } from 'react';
import LeftNav from '../components/messenger/LeftNav';
import ChatInterface from '../components/messenger/ChatInterface';
import type { Message, Friend } from '../components/messenger/types';

const ChatPage = () => {
  const [isDark, setIsDark] = useState(false);
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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`h-screen ${isDark ? 'dark' : ''}`}>
      <div className="h-screen flex bg-background">
        <LeftNav 
          activeTab="chats"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          friends={friends}
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
        />
      </div>
    </div>
  );
};

export default ChatPage;