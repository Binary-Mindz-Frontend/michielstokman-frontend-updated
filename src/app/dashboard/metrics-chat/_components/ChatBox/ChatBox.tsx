'use client';

import { useSendMetricsChatMessageMutation } from '@/redux/features/admin/adminMetricsChat/adminMetricsChat.api';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  items?: string[];
}

const ChatBox = () => {
  // Correctly destructure RTK Mutation tuple
  const [sendMetricsChatMessage, { isLoading: isApiLoading }] = useSendMetricsChatMessageMutation();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isApiLoading]);

  // Helper function to turn API markdown **text** into clean HTML bold tags safely
  const renderFormattedContent = (content: string) => {
    if (!content) return '';

    // Split lines to preserve layout, handle **bold**, and stitch back together
    return content.split('\n').map((line, index) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index} className="block min-h-5">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIndex} className="font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isApiLoading) return;

    const userMessage: IMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      // CHANGED: sending "query" instead of "message" to match your backend's expected schema
      const response = await sendMetricsChatMessage({ query: currentInput }).unwrap();

      if (response?.success && response?.data?.answer) {
        const aiMessage: IMessage = {
          role: 'assistant',
          content: response.data.answer,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error('Malformed data structure received');
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue retrieving those metrics. Please try again.',
        },
      ]);
    }
  };
  return (
    <div className="border-primary/10 mx-auto flex h-[77vh] w-full flex-col overflow-hidden rounded-md border bg-[#FDFCFB]">
      {/* Header */}
      <div className="border-primary/10 flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#F8F7F3] p-2">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-secondary text-xl font-semibold">Admin AI Insights</h2>
            <p className="text-secondary font-sans text-[10px] tracking-widest uppercase">
              Powered by Metrics Engine
            </p>
          </div>
        </div>
        <span className="text-success flex items-center gap-2 rounded-full bg-[#E6F6F0] px-3 py-1 text-xs font-medium">
          <div className="bg-success h-2 w-2 animate-pulse rounded-full" />
          AI Online
        </span>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto scroll-smooth bg-[#F8F7F3]/40 p-6"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg?.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
          >
            {msg?.role === 'assistant' && (
              <div className="bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`w-max-w-[90%] rounded-md p-3 transition-all md:max-w-[45%] ${
                msg?.role === 'user'
                  ? 'shadow-brown-200 bg-dark-primary rounded-br-none text-white'
                  : 'text-secondary border-primary/10 rounded-bl-none border bg-white'
              }`}
            >
              <div className="text-sm leading-relaxed md:text-base">
                {renderFormattedContent(msg?.content)}
              </div>

              {msg?.items && (
                <div className="mt-4 space-y-2 border-t border-[#F8F7F3] pt-3 text-sm md:text-base">
                  {msg?.items.map((item, i) => (
                    <div key={i} className="text-primary flex gap-2 font-bold italic">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg?.role === 'user' && (
              <div className="border-primary/10 bg-primary/50 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isApiLoading && (
          <div className="flex items-center justify-start gap-3">
            <div className="bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
              <Loader2 size={18} className="animate-spin" />
            </div>
            <div className="text-secondary border-primary/10 rounded-md rounded-bl-none border bg-white p-3 italic">
              AI is analyzing metrics...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-primary/10 border-t bg-white p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="focus-within:ring-primary/20 border-primary/10 relative flex items-center gap-3 rounded-md border bg-[#F8F7F3] p-2 text-sm shadow-inner transition-all focus-within:ring-2 md:text-base"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isApiLoading}
            placeholder="Ask anything about this week's performance..."
            className="text-secondary placeholder:text-secondary flex-1 border-none bg-transparent px-2 py-2 outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isApiLoading}
            className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all md:px-6 ${
              !input.trim() || isApiLoading
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-primary text-white shadow-md hover:bg-[#8B5D45] active:scale-95'
            }`}
          >
            <span className="hidden md:block">Send</span> <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
