import React, { useState, useRef, useEffect } from 'react';
import { Note } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, BotIcon, UserIcon, Loader2Icon } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

interface ChatInterfaceProps {
  notes: Note[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ notes }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock AI response based on the query
  const getAIResponse = async (query: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const queryLower = query.toLowerCase();
    
    // Simple keyword-based responses
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return "Hello! I'm your Smart Notes assistant. How can I help you with your notes today?";
    }
    
    if (queryLower.includes('how are you')) {
      return "I'm just a bot, but I'm here and ready to help you with your notes!";
    }
    
    // Search for notes based on query
    const searchTerm = queryLower.replace(/[^\w\s]/gi, '').split(' ')
      .filter(word => word.length > 2 && !['the', 'and', 'your', 'my', 'show', 'find', 'search'].includes(word));
    
    if (searchTerm.length > 0) {
      const matchedNotes = notes.filter(note => 
        searchTerm.some(term => 
          note.title.toLowerCase().includes(term) || 
          note.content.toLowerCase().includes(term) ||
          (note.tags && note.tags.some(tag => tag.toLowerCase().includes(term)))
        )
      );
      
      if (matchedNotes.length > 0) {
        if (matchedNotes.length === 1) {
          return `I found a note matching "${searchTerm.join(' ')}":\n\n` +
                 `**${matchedNotes[0].title}**\n` +
                 `${matchedNotes[0].content.substring(0, 200)}${matchedNotes[0].content.length > 200 ? '...' : ''}`;
        } else {
          return `I found ${matchedNotes.length} notes matching "${searchTerm.join(' ')}":\n\n` +
                 matchedNotes.map(note => `- **${note.title}**`).join('\n');
        }
      }
    }
    
    // Default response
    return "I'm here to help you with your notes. Try asking about your notes, like 'Show me my shopping list' or 'What notes do I have about work?'";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await getAIResponse(input);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <BotIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">How can I help you today?</h3>
            <p className="max-w-md">Ask me anything about your notes, like "What did I note about the project?" or "Show me my shopping list"</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${message.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-900'} rounded-2xl px-4 py-2`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'assistant' && (
                    <div className="mt-1">
                      <BotIcon className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                  {message.sender === 'user' && (
                    <div className="mt-1">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 text-neutral-900 rounded-2xl px-4 py-2">
              <div className="flex items-center gap-2">
                <BotIcon className="w-5 h-5 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-neutral-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your notes..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="px-4"
          >
            {isLoading ? (
              <Loader2Icon className="w-5 h-5 animate-spin" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
