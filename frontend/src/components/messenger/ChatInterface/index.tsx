import type { Friend, Message } from '../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatInterfaceProps {
  activeChat: Friend | null;
  messages: Message[];
  isDark: boolean;
  isInCall: boolean;
  setIsInCall: (inCall: boolean) => void;
  toggleTheme: () => void;
}

const ChatInterface = ({
  activeChat,
  messages,
  isDark,
  isInCall,
  setIsInCall,
  toggleTheme,
}: ChatInterfaceProps) => (
  <div className="flex-1 flex flex-col">
    <ChatHeader 
      activeChat={activeChat}
      isDark={isDark}
      isInCall={isInCall}
      setIsInCall={setIsInCall}
      toggleTheme={toggleTheme}
    />
    <MessageList messages={messages} />
    <MessageInput />
  </div>
);

export default ChatInterface;