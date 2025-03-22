
import React from 'react';
import { Message, User } from '../store/chatStore';
import UserAvatar from './UserAvatar';
import { Check, CheckCheck } from 'lucide-react';
import VoiceMessageBubble from './VoiceMessageBubble';

type MessageBubbleProps = {
  message: Message;
  sender: Partial<User>;
  isLast?: boolean;
};

const MessageStatus: React.FC<{ status: Message['status'] }> = ({ status }) => {
  switch (status) {
    case 'sending':
      return <span className="text-muted-foreground text-xs">Sending</span>;
    case 'sent':
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-primary" />;
    case 'failed':
      return <span className="text-destructive text-xs">Failed</span>;
    default:
      return null;
  }
};

const LinkPreview: React.FC<{ url: string, title: string }> = ({ url, title }) => {
  return (
    <div className="link-preview">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground truncate">{url}</div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender, isLast = false }) => {
  const isUser = sender.id === 'user1';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  // Check if the message has any URLs
  const hasLinks = message.text.includes('http');
  
  // Check if this is a voice message
  const isVoiceMessage = message.audioUrl !== undefined;

  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? 'justify-end' : 'justify-start'} appear`}>
      {!isUser && <UserAvatar user={sender} size="sm" />}
      
      <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
        {isVoiceMessage ? (
          <VoiceMessageBubble audioUrl={message.audioUrl!} />
        ) : (
          <div 
            className="message-content" 
            dangerouslySetInnerHTML={{ __html: message.formattedText || message.text }}
          />
        )}
        
        {hasLinks && !isVoiceMessage && (
          <LinkPreview 
            url="https://example.com/resource"
            title="Educational Resource"
          />
        )}
        
        <div className={`message-status ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs">{formattedTime}</span>
          {isUser && <MessageStatus status={message.status} />}
        </div>
      </div>
      
      {isUser && <UserAvatar user={sender} size="sm" />}
    </div>
  );
};

export default MessageBubble;
