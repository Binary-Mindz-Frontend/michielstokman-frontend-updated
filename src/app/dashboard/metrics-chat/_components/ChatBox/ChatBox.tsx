'use client';

// import { useSendMetricsChatMessageMutation } from '@/redux/features/admin/adminMetricsChat/adminMetricsChat.api';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  items?: string[];
}

const ChatBox = () => {
  // const [chatbox, isloading] = useSendMetricsChatMessageMutation()
  const [messages, setMessages] = useState<IMessage[]>([
    {
      role: 'assistant',
      content:
        'Welcome to the Admin console. Ask me about metrics, content performance, or growth areas',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: IMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: IMessage = {
        role: 'assistant',
        content: `I analyzed the data for "${userMessage.content}". Here are the findings:`,
        items: [
          '• Overall pulse score increased by 4.2%',
          '• Top performing content is still "The Day I Said No"',
          '• User engagement is highest between 8 PM - 10 PM',
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="border-primary/10 mx-auto flex h-200 w-full flex-col overflow-hidden rounded-md border bg-[#FDFCFB]">
      {/* Header */}
      <div className="border-primary/10 flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#F8F7F3] p-2">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-dark-primary text-xl font-semibold">Admin AI Insights</h2>
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
                  : 'text-dark-primary border-primary/10 rounded-bl-none border bg-white'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap md:text-base">
                {msg?.content}
              </p>

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
        {isTyping && (
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
            placeholder="Ask anything about this week's performance..."
            className="text-dark-primary placeholder:text-secondary flex-1 border-none bg-transparent py-2 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all md:px-6 ${
              !input.trim() || isTyping
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
