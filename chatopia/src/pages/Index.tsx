
import React, { useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/ChatHeader';
import MessageList from '@/components/MessageList';
import ChatInput from '@/components/ChatInput';
import useChatStore from '@/store/chatStore';
import { toast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSendVoiceMessage,
    handleKeyDown,
    isSending,
    isTyping,
    messagesEndRef,
    theme,
    toggleTheme,
  } = useChat();
  
  const { users, activeChat } = useChatStore();

  useEffect(() => {
    // Set body class based on theme
    document.body.className = theme;
    
    // Show welcome toast
    if (messages.length <= 3) {
      toast({
        title: "Welcome to EduChat",
        description: "Start typing to chat with your AI educational assistant.",
      });
    }
  }, [theme, messages.length]);

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <ChatHeader
        chatName={activeChat.name}
        isTyping={isTyping}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <MessageList
        messages={messages}
        users={users}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onSendVoice={handleSendVoiceMessage}
        onKeyDown={handleKeyDown}
        isSending={isSending}
      />
    </div>
  );
};

export default Index;
