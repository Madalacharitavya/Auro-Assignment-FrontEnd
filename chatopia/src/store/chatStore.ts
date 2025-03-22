
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserStatus = 'online' | 'offline' | 'typing';

export type User = {
  id: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: Date;
};

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type Message = {
  id: string;
  text: string;
  userId: string;
  timestamp: Date;
  status: MessageStatus;
  formattedText?: string;
  audioUrl?: string; // URL for voice messages
};

interface ChatState {
  messages: Message[];
  users: User[];
  currentUser: User;
  activeChat: {
    id: string;
    name: string;
    typing: boolean;
  };
  theme: 'light' | 'dark';
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  addVoiceMessage: (audioBlob: Blob, userId: string) => void; // New method for voice messages
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  setUserStatus: (userId: string, status: UserStatus) => void;
  setTyping: (typing: boolean) => void;
  toggleTheme: () => void;
}

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      users: [
        {
          id: 'user1',
          name: 'You',
          status: 'online',
        },
        {
          id: 'ai',
          name: 'EduAI',
          status: 'online',
        },
      ],
      currentUser: {
        id: 'user1',
        name: 'You',
        status: 'online',
      },
      activeChat: {
        id: 'chat1',
        name: 'Educational AI Chat',
        typing: false,
      },
      theme: 'light',
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `msg_${Date.now()}`,
              timestamp: new Date(),
              status: 'sending',
              ...message,
            },
          ],
        })),
      addVoiceMessage: (audioBlob, userId) => {
        // Create an object URL for the audio blob
        const audioUrl = URL.createObjectURL(audioBlob);
        
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `msg_${Date.now()}`,
              text: '🎤 Voice Message',
              userId,
              timestamp: new Date(),
              status: 'sending',
              audioUrl,
            },
          ],
        }));
      },
      updateMessageStatus: (id, status) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, status } : message
          ),
        })),
      setUserStatus: (userId, status) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, status, lastSeen: status === 'offline' ? new Date() : user.lastSeen } : user
          ),
        })),
      setTyping: (typing) =>
        set((state) => ({
          activeChat: { ...state.activeChat, typing },
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'chat-storage',
    }
  )
);

export default useChatStore;
