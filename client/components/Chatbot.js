"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import chatbotService from '../services/chatbot.service';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! How can I help you with your tasks today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = e.target.message.value.trim();
    if (!userInput || isLoading) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setIsLoading(true);
    e.target.reset();

    try {
      const response = await chatbotService.sendMessage(userInput);
      setMessages([...newMessages, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages([...newMessages, { sender: 'ai', text: "Sorry, I'm having a bit of trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center text-primary-foreground z-50"
        aria-label="Open Task Assistant"
      >
        <Bot size={32} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-sm sm:w-[360px] h-[550px] bg-card rounded-2xl shadow-2xl flex flex-col border border-border z-50 overflow-hidden"
          >
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">TaskMaster AI</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </header>

            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-lg' : 'bg-muted text-foreground rounded-bl-lg'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl bg-muted text-foreground">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-border flex gap-2">
              <input
                name="message"
                placeholder="Ask about your tasks..."
                autoComplete="off"
                className="flex-grow p-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" className="p-2 bg-primary rounded-md text-primary-foreground disabled:bg-muted" disabled={isLoading} aria-label="Send message">
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
