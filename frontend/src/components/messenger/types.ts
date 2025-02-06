export interface Message {
    id: number;
    content: string;
    sender: string;
    timestamp: string;
  }
  
  export interface Friend {
    id: number;
    name: string;
    avatar: string;
    lastMessage?: string;
    online?: boolean;
  }
  
  export interface FriendRequest {
    id: number;
    name: string;
    avatar: string;
  }