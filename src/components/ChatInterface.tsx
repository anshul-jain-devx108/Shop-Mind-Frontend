
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Message, Product } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onProductClick: (product: Product) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  onProductClick 
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
      
      // Show typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQueries = [
    "Show me laptops under $2000",
    "I need wireless headphones", 
    "Find programming books",
    "Show me running shoes"
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Enhanced Chat Header with Animation */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 animate-pulse"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="p-2 bg-white/20 rounded-full animate-scale-in">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center space-x-2">
              <span>ShopMind Assistant</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </h3>
            <p className="text-sm opacity-90 animate-fade-in">Online • Ready to help you shop</p>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8 animate-fade-in">
            <div className="mb-6">
              <Bot className="h-20 w-20 mx-auto mb-4 text-primary animate-bounce" />
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Start a conversation
              </h3>
              <p className="text-lg mb-6">Ask me about products you're looking for. Try:</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSendMessage(query)}
                  className="text-left justify-start hover-scale transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-primary mr-2">💡</span>
                  "{query}"
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex animate-fade-in ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-full transition-all duration-200 hover-scale ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-primary to-blue-600 shadow-lg' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Card className={`p-4 transition-all duration-200 hover:shadow-md ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg' 
                    : 'bg-white shadow-sm border-l-4 border-l-primary/20'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </Card>
                <p className="text-xs text-muted-foreground px-2 opacity-70">
                  {formatTime(message.timestamp)}
                </p>
                
                {/* Enhanced Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.products.map((product, productIndex) => (
                      <div 
                        key={product.id}
                        className="animate-scale-in hover-scale"
                        style={{ animationDelay: `${productIndex * 0.1}s` }}
                      >
                        <ProductCard
                          product={product}
                          onClick={() => onProductClick(product)}
                          compact
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="p-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <Card className="p-4 bg-white shadow-sm border-l-4 border-l-primary/20">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">ShopMind is thinking...</span>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-gradient-to-r from-gray-50 to-white">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about products..."
              className="pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-white/80 backdrop-blur-sm"
            />
            {input && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!input.trim()}
            className="transition-all duration-200 hover-scale bg-gradient-to-r from-primary to-blue-600 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
