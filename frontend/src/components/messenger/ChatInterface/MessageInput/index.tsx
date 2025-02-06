import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Mic, Send } from 'lucide-react';

const MessageInput = () => (
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
);

export default MessageInput;