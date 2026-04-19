import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Star, ExternalLink } from 'lucide-react';
import { sendMessage, toggleChat, closeChat } from '../../app/slices/chatSlice';

// Render structured bot response data
const BotDataRenderer = ({ data, onSuggestion }) => {
  if (!data) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Products */}
      {data.products?.length > 0 && (
        <div className="space-y-1.5">
          {(data.showAll ? data.products : data.products.slice(0, 4)).map((p) => (
            <a key={p.id} href={`/product/${p.slug}`} className="flex items-center gap-2 px-2 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition text-xs">
              {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <div className="flex items-center gap-1">
                  <span className="text-accent font-bold">${p.finalPrice || p.price}</span>
                  {p.discount > 0 && <span className="line-through text-gray-500 text-[10px]">${p.price}</span>}
                  {p.rating > 0 && <span className="flex items-center text-yellow-400 ml-1"><Star className="w-3 h-3 fill-current" />{p.rating.toFixed(1)}</span>}
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-500 flex-shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* Categories */}
      {data.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.categories.map((c) => (
            <span key={c.name} className="px-2 py-1 bg-accent/20 text-accent rounded-full text-[10px] capitalize">
              {c.name} ({c.count})
            </span>
          ))}
        </div>
      )}

      {/* Cart Items */}
      {data.items?.length > 0 && data.type === 'cart' && (
        <div className="space-y-1">
          {data.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs px-2 py-1 bg-white/10 rounded">
              <span className="truncate">{item.title} x{item.quantity}</span>
              <span className="text-accent ml-2">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {data.total && (
            <div className="flex justify-between text-xs font-bold px-2 pt-1 border-t border-white/10">
              <span>Total</span><span className="text-accent">${data.total.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {data.orders?.length > 0 && (
        <div className="space-y-1">
          {data.orders.map((o, i) => (
            <a key={i} href={`/orders`} className="flex justify-between items-center text-xs px-2 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <div>
                <span className="text-accent font-mono">{o.orderNumber}</span>
                <span className="ml-2 capitalize text-gray-400">{o.status}</span>
              </div>
              <span className="font-medium">${o.total?.toFixed(2)}</span>
            </a>
          ))}
        </div>
      )}

      {/* Order tracking timeline */}
      {data.timeline?.length > 0 && (
        <div className="space-y-1.5">
          {data.timeline.slice(-4).map((step, idx) => (
            <div key={`${step.status}-${idx}`} className="flex items-start gap-2 px-2 py-1.5 bg-white/10 rounded-lg text-xs">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-accent" />
              <div>
                <p className="capitalize font-medium">{step.status}</p>
                {step.note && <p className="text-gray-400">{step.note}</p>}
                {step.timestamp && (
                  <p className="text-[10px] text-gray-500">
                    {new Date(step.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {data.suggestions.map((s) => (
            <button key={s} onClick={() => onSuggestion(s)}
              className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-[10px] hover:bg-accent/20 transition">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChatbotWidget = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, loading } = useSelector((s) => s.chat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const text = typeof e === 'string' ? e : input.trim();
    if (!text || loading) return;
    setInput('');
    dispatch(sendMessage(text));
  };

  const handleSuggestion = (text) => {
    if (loading) return;
    dispatch(sendMessage(text));
  };

  const quickActions = [
    { label: '🔥 Trending Products', text: 'Show trending products' },
    { label: '💰 Budget Friendly', text: 'Show products under $50' },
    { label: '📦 Track My Order', text: 'Where is my order?' },
    { label: '🛒 View Cart', text: 'What\'s in my cart?' },
    { label: '📂 Categories', text: 'What categories do you have?' },
    { label: '🚚 Shipping Info', text: 'Shipping policy' },
    { label: '↩️ Return Policy', text: 'Return policy' },
    { label: '💎 Premium Products', text: 'Show premium products' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => dispatch(toggleChat())}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-white rounded-full shadow-lg shadow-accent/30 flex items-center justify-center"
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-160px)] bg-[#16213E] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-accent/10 border-b border-white/10">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">FitStore AI Assistant</p>
                <p className="text-xs text-green-400">Online — Ask me anything</p>
              </div>
              <button onClick={() => dispatch(closeChat())} className="p-1 hover:bg-white/10 rounded-lg transition">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <Bot className="w-10 h-10 text-accent mx-auto mb-2" />
                  <p className="text-sm text-gray-300 mb-3">Hi! I can help you find products, track orders, manage your cart, and more.</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickActions.map((action) => (
                      <button
                        key={action.text}
                        onClick={() => handleSuggestion(action.text)}
                        className="text-left px-2.5 py-2 bg-white/5 rounded-lg text-xs text-gray-300 hover:bg-white/10 transition"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-accent" />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-white rounded-br-sm'
                      : 'bg-white/10 text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.content}
                    {msg.role === 'bot' && msg.data && (
                      <BotDataRenderer data={msg.data} onSuggestion={handleSuggestion} />
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="px-3 py-2 bg-white/10 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products, orders, shipping..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
