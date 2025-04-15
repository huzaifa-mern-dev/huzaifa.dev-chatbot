
'use client';

import {useEffect, useRef, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {generateResponse} from '@/ai/flows/generate-response';
import {cn} from '@/lib/utils';
import {Loader2} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

const GREETING_MESSAGE = 'Hello! Ask me anything about my skills and projects.';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'greeting',
    text: GREETING_MESSAGE,
    isUser: false,
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const {toast} = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    chatBottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse({question: input});
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response.response,
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error('Error generating response:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error generating a response. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          className="rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent-foreground hover:text-accent transition-colors"
          onClick={handleToggle}
        >
          Chat with me
        </Button>
      )}

      {isOpen && (
        <div className="w-96 h-[40rem] rounded-lg shadow-xl overflow-hidden flex flex-col bg-secondary border border-border">
          <div className="bg-primary text-primary-foreground p-4">
            <h2 className="text-lg font-semibold">DevChat</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-center">
                  {!message.isUser && (
                    <Avatar className="mr-2">
                      <AvatarImage src="https://picsum.photos/50/50" alt="Bot Avatar"/>
                      <AvatarFallback>Bot</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'rounded-lg p-2 max-w-[70%] break-words',
                      message.isUser ? 'bg-primary-foreground text-primary' : 'bg-accent text-accent-foreground'
                    )}
                  >
                    {message.text}
                  </div>
                  {message.isUser && (
                    <Avatar className="ml-2">
                      <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar"/>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Avatar className="mr-2">
                  <AvatarImage src="https://picsum.photos/50/50" alt="Bot Avatar"/>
                  <AvatarFallback>Bot</AvatarFallback>
                </Avatar>
                <div className="bg-accent text-accent-foreground rounded-lg p-2">
                  Typing <Loader2 className="inline-block animate-spin"/>
                </div>
              </div>
            )}
            <div ref={chatBottomRef}/>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={handleInputChange}
                className="flex-1 rounded-md"
                disabled={isLoading}
              />
              <Button type="submit" className="bg-accent text-accent-foreground rounded-md" disabled={isLoading}>
                Send
              </Button>
            </div>
          </form>
          <Button
            variant="secondary"
            className="w-full rounded-none"
            onClick={handleToggle}
          >
            Close Chat
          </Button>
        </div>
      )}
    </div>
  );
}
