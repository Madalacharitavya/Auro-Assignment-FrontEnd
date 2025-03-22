
import { useEffect, useRef, useState } from 'react';
import useChatStore from '../store/chatStore';
import { simulateResponse, updateMessageStatusWithDelay, formatMessageText, mockMessages } from '../lib/mockData';

export const useChat = () => {
  const {
    messages,
    addMessage,
    addVoiceMessage,
    updateMessageStatus,
    setTyping,
    activeChat,
    currentUser,
    theme,
    toggleTheme,
  } = useChatStore();
  
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize store with mock data if empty
  useEffect(() => {
    if (messages.length === 0) {
      mockMessages.forEach(msg => {
        addMessage({
          text: msg.text,
          userId: msg.userId,
          formattedText: formatMessageText(msg.text),
        });
      });
    }
  }, [messages.length, addMessage]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setIsSending(true);
    
    // Format the message text
    const formattedText = formatMessageText(inputValue);
    
    // Add user message to store
    addMessage({
      text: inputValue,
      userId: currentUser.id,
      formattedText,
    });
    
    // Get the last message id to update its status
    const messageId = `msg_${Date.now()}`;
    
    // Clear input
    setInputValue('');
    
    // Simulate message sending flow
    updateMessageStatusWithDelay(messageId, updateMessageStatus);
    
    // Simulate bot typing and response
    setTyping(true);
    
    simulateResponse(inputValue, (response) => {
      setTyping(false);
      addMessage({
        text: response.text,
        userId: response.userId,
        formattedText: formatMessageText(response.text),
      });
      setIsSending(false);
    });
  };

  const handleSendVoiceMessage = (audioBlob: Blob) => {
    setIsSending(true);
    
    // Add voice message to store
    addVoiceMessage(audioBlob, currentUser.id);
    
    // Get the last message id to update its status
    const messageId = `msg_${Date.now()}`;
    
    // Simulate message sending flow
    updateMessageStatusWithDelay(messageId, updateMessageStatus);
    
    // Simulate bot typing and response
    setTyping(true);
    
    // Simulate AI response to voice message
    setTimeout(() => {
      setTyping(false);
      addMessage({
        text: "I've received your voice message. Is there anything specific you'd like to discuss about that topic?",
        userId: 'ai',
        formattedText: formatMessageText("I've received your voice message. Is there anything specific you'd like to discuss about that topic?"),
      });
      setIsSending(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleSendVoiceMessage,
    handleKeyDown,
    isSending,
    isTyping: activeChat.typing,
    messagesEndRef,
    theme,
    toggleTheme,
  };
};
