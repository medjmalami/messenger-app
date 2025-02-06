import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Sun, 
  Moon,
  LogOut,
  UserPlus,
  Phone,
  Search,
  Users,
  MessageSquare,
  UserPlus2
} from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  lastMessage?: string;
  online?: boolean;
}

interface FriendRequest {
  id: number;
  name: string;
  avatar: string;
}

const MessengerApp = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [activeChat, setActiveChat] = useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [messages, setMessages] = useState<Message[]>([
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

  const AuthForm = () => (
    <Card className="w-full max-w-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {showSignUp ? 'Create Account' : 'Sign In'}
      </h2>
      {showSignUp && (
        <Input placeholder="Full Name" type="text" className="w-full" />
      )}
      <Input placeholder="Email" type="email" className="w-full" />
      <Input placeholder="Password" type="password" className="w-full" />
      {showSignUp && (
        <Input placeholder="Confirm Password" type="password" className="w-full" />
      )}
      <Button className="w-full" onClick={() => setIsLoggedIn(true)}>
        {showSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
      <p className="text-center text-sm">
        {showSignUp ? 'Already have an account?' : "Don't have an account?"}
        <span 
          className="text-blue-500 cursor-pointer ml-1"
          onClick={() => setShowSignUp(!showSignUp)}
        >
          {showSignUp ? 'Sign In' : 'Sign Up'}
        </span>
      </p>
    </Card>
  );

  const LeftNav = () => (
    <div className="w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
      <Search className="h-4 w-4 text-gray-500 mr-2" />
      <Input
        placeholder="Search friends or messages..."
        className="w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
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
          <ScrollArea className="h-[calc(100vh-10rem)]">
            {friends.map(friend => (
              <div
                key={friend.id}
                className={`p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                  activeChat?.id === friend.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={() => setActiveChat(friend)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  {friend.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{friend.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {friend.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="friends" className="flex-1">
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
        </TabsContent>

        <TabsContent value="requests" className="flex-1">
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
        </TabsContent>
      </Tabs>
    </div>
  );

  const ChatInterface = () => (
    <div className="flex-1 flex flex-col">
      {/* Header */}
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
            onClick={() => setIsLoggedIn(false)}
          >
            <LogOut />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip />
          </Button>
          <Input 
            placeholder="Type a message..." 
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Mic />
          </Button>
          <Button>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-screen ${isDark ? 'dark' : ''}`}>
      {!isLoggedIn ? (
        <div className="h-screen flex items-center justify-center p-4 bg-background">
          <AuthForm />
        </div>
      ) : (
        <div className="h-screen flex bg-background">
          <LeftNav />
          <ChatInterface />
        </div>
      )}
    </div>
  );
};

export default MessengerApp;