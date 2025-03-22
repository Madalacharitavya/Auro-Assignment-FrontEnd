
import React from 'react';
import MessageBubble from './MessageBubble';
import { Message, User } from '../store/chatStore';

type MessageListProps = {
  messages: Message[];
  users: User[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 mb-3 appear">
      <div className="message-bubble bot-message">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  users, 
  isTyping, 
  messagesEndRef 
}) => {
  const getUserById = (userId: string): User => {
    return users.find(user => user.id === userId) || {
      id: userId,
      name: 'Unknown User',
      status: 'offline'
    };
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            sender={getUserById(message.userId)}
            isLast={index === messages.length - 1}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
