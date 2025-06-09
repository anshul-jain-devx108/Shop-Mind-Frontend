
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Search, Zap, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Conversations",
      description: "Natural language chat interface that understands your shopping needs"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Find products instantly with AI-powered search and recommendations"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant responses and product suggestions in real-time"
    }
  ];

  const sampleQueries = [
    "Show me laptops under $2000",
    "I need wireless headphones",
    "Find programming books",
    "Show me running shoes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopMind
              </h1>
            </div>
            <Link to="/chat">
              <Button className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Start Chatting</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Intelligent
              </span>
              <br />
              <span className="text-foreground">Shopping Assistant</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the future of e-commerce with ShopMind. Our AI-powered chatbot helps you find exactly what you need through natural conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="text-lg px-8 py-6">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try ShopMind Now
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Star className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ShopMind?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI technology to revolutionize your shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Queries Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Try These Sample Queries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {sampleQueries.map((query, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{query}</span>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Start Your Shopping Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/80 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopMind
            </span>
          </div>
          <p className="text-muted-foreground">
            Your intelligent shopping assistant powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
