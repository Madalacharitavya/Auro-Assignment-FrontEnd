
import { Message, User, MessageStatus } from '../store/chatStore';

// Sample users for the chat
export const mockUsers: User[] = [
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
];

// Sample initial messages for the chat
export const mockMessages: Message[] = [
  {
    id: 'msg1',
    text: 'Hello! I\'m your AI educational assistant. I\'m here to help you learn more effectively. What would you like to learn about today?',
    userId: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: 'read',
  },
  {
    id: 'msg2',
    text: 'Can you tell me about quantum computing?',
    userId: 'user1',
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    status: 'read',
  },
  {
    id: 'msg3',
    text: 'Quantum computing is a fascinating field that uses quantum mechanics to perform computations. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or "qubits" that can exist in multiple states simultaneously due to a property called superposition.\n\nThis gives quantum computers the potential to solve certain problems much faster than classical computers, especially in areas like cryptography, material science, and complex system modeling.',
    userId: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    status: 'read',
  },
];

// Simulate sending a message and receiving a response
export const simulateResponse = (
  message: string,
  callback: (response: Message) => void
) => {
  // First set the typing indicator
  setTimeout(() => {
    // Generate a response based on the message
    const responses = [
      "That's a great question! Let me explain in detail...",
      "I understand what you're asking. Here's what I know about that topic:",
      "This is an interesting topic. Let me share some educational insights:",
      "I'd be happy to explain this concept. Here's a comprehensive overview:",
    ];
    
    const topics = {
      "quantum": "Quantum computing utilizes quantum mechanics principles to process information. Unlike traditional computers that use bits (0 or 1), quantum computers use qubits that can exist in multiple states simultaneously through superposition.",
      "ai": "Artificial Intelligence (AI) refers to systems designed to mimic human intelligence. Machine Learning, a subset of AI, enables systems to learn from data without explicit programming. Deep Learning uses neural networks with multiple layers to process complex patterns.",
      "history": "Historical studies provide context for our modern world. By examining past events, societies, and cultures, we can better understand current global dynamics and anticipate future trends.",
      "math": "Mathematics is the universal language that describes patterns and relationships. From basic arithmetic to advanced calculus, it provides tools to model and solve real-world problems across all scientific disciplines.",
      "science": "Scientific inquiry is based on the systematic observation, measurement, and experimentation with phenomena. The scientific method provides a framework for developing and testing hypotheses to expand our understanding of the natural world.",
      "programming": "Programming involves writing instructions for computers to execute. Modern programming paradigms include object-oriented, functional, and event-driven approaches, each with specific use cases and benefits."
    };

    // Check if the message contains any keywords
    let responseContent = responses[Math.floor(Math.random() * responses.length)];
    
    // Add topic-specific content if relevant
    for (const [keyword, content] of Object.entries(topics)) {
      if (message.toLowerCase().includes(keyword)) {
        responseContent += " " + content;
        break;
      }
    }

    // If no specific topic was found, provide a generic educational response
    if (responseContent === responses[Math.floor(Math.random() * responses.length)]) {
      responseContent += " I'm designed to help with educational topics across various disciplines. Feel free to ask about specific subjects like quantum computing, artificial intelligence, mathematics, science, history, or programming concepts.";
    }

    // Create response message
    const response: Message = {
      id: `msg_${Date.now()}`,
      text: responseContent,
      userId: 'ai',
      timestamp: new Date(),
      status: 'sent',
    };

    callback(response);
  }, 1500); // Simulate typing delay
};

export const formatMessageText = (text: string): string => {
  // Replace markdown-style formatting with HTML
  let formattedText = text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />');

  return formattedText;
};

// Update message status with delays to simulate network
export const updateMessageStatusWithDelay = (
  messageId: string,
  updateStatus: (id: string, status: MessageStatus) => void
) => {
  // Simulate sending
  setTimeout(() => {
    updateStatus(messageId, 'sent');
    
    // Simulate delivered
    setTimeout(() => {
      updateStatus(messageId, 'delivered');
      
      // Simulate read
      setTimeout(() => {
        updateStatus(messageId, 'read');
      }, 2000);
    }, 1000);
  }, 800);
};
