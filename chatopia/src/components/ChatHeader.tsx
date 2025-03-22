
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import UserAvatar from './UserAvatar';

type ChatHeaderProps = {
  chatName: string;
  isTyping: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  isTyping,
  theme,
  toggleTheme,
}) => {
  return (
    <div className="px-4 py-3 border-b glass">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar 
            user={{ 
              id: 'ai', 
              name: 'EduAI',
              status: isTyping ? 'typing' : 'online',
            }} 
          />
          
          <div className="flex flex-col">
            <h1 className="font-medium">{chatName}</h1>
            <span className="text-xs text-muted-foreground">
              {isTyping ? 'Typing...' : 'Online'}
            </span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
