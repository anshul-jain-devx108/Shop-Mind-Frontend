
import { useState, useEffect } from 'react';
import type { Message } from '../types';

export const useChatHistory = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('shopmind-chat-history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('shopmind-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('shopmind-chat-history');
  };

  return {
    messages,
    addMessage,
    clearHistory
  };
};
