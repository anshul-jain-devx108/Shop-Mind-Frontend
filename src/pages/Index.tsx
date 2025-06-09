

import React, { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { ProductGrid } from '../components/ProductGrid';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { AuthSystem } from '../components/AuthSystem';
import { useProducts } from '../hooks/useProducts';
import { useChatAnalytics } from '../hooks/useChatAnalytics';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';

const Index = () => {
  console.log('Index component rendering...');
  
  const { products, searchProducts, filteredProducts, filters, updateFilters } = useProducts();
  const { messages, addMessage, clearHistory } = useChatAnalytics();
  const { user, login, logout, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'products'>('chat');

  console.log('Auth state:', { user, isAuthenticated, isLoading });

  const handleChatMessage = async (message: string) => {
    console.log('Chat message:', message);
    // Add user message
    addMessage({ id: Date.now().toString(), content: message, sender: 'user', timestamp: new Date() });
    
    // Process message and search products
    const searchResults = await searchProducts(message);
    
    // Add bot response
    if (searchResults.length > 0) {
      addMessage({
        id: (Date.now() + 1).toString(),
        content: `I found ${searchResults.length} products matching your search. Here are some great options:`,
        sender: 'bot',
        timestamp: new Date(),
        products: searchResults.slice(0, 3)
      });
      setCurrentView('products');
    } else {
      addMessage({
        id: (Date.now() + 1).toString(),
        content: "I couldn't find any products matching your search. Try searching for electronics, books, or clothing.",
        sender: 'bot',
        timestamp: new Date()
      });
    }
  };

  const handleAuthLogin = (user: User) => {
    console.log('Auth login:', user);
    login(user);
  };

  // Show loading while checking authentication
  if (isLoading) {
    console.log('Showing loading screen...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading ShopMind...</p>
        </div>
      </div>
    );
  }

  // Show authentication if not logged in
  if (!isAuthenticated) {
    console.log('Showing auth system...');
    return <AuthSystem onLogin={handleAuthLogin} onClose={() => {}} />;
  }

  console.log('Showing main app...');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onViewChange={setCurrentView}
        currentView={currentView}
        user={user}
        onLogout={logout}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          filters={filters}
          onFiltersChange={updateFilters}
          onClearHistory={clearHistory}
          messageCount={messages.length}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'} pt-16`}>
          <div className="container mx-auto px-4 py-6">
            {currentView === 'chat' ? (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Welcome back, {user?.name}!
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    Your intelligent shopping assistant. Ask me about products, and I'll help you find exactly what you need!
                  </p>
                  <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Try asking me:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 rounded-lg p-3 text-blue-800">"Show me laptops under $2000"</div>
                      <div className="bg-purple-50 rounded-lg p-3 text-purple-800">"I need wireless headphones"</div>
                      <div className="bg-green-50 rounded-lg p-3 text-green-800">"Find programming books"</div>
                      <div className="bg-orange-50 rounded-lg p-3 text-orange-800">"Show me running shoes"</div>
                    </div>
                  </div>
                </div>
                <ChatInterface 
                  messages={messages}
                  onSendMessage={handleChatMessage}
                  onProductClick={(product) => {
                    addMessage({
                      id: Date.now().toString(),
                      content: `Great choice! The ${product.name} is one of our popular items. Would you like to see similar products or add this to your cart?`,
                      sender: 'bot',
                      timestamp: new Date(),
                      products: [product]
                    });
                  }}
                />
              </div>
            ) : (
              <ProductGrid 
                products={filteredProducts}
                onProductClick={(product) => {
                  setCurrentView('chat');
                  addMessage({
                    id: Date.now().toString(),
                    content: `Tell me more about the ${product.name}`,
                    sender: 'user',
                    timestamp: new Date()
                  });
                  addMessage({
                    id: (Date.now() + 1).toString(),
                    content: `The ${product.name} is an excellent choice! ${product.description} It's currently priced at $${product.price}. Would you like to add it to your cart or see similar products?`,
                    sender: 'bot',
                    timestamp: new Date(),
                    products: [product]
                  });
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

