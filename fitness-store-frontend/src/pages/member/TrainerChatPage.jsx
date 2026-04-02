import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import MemberLayout from '../../layouts/MemberLayout';
import SEO from '../../components/seo/SEO';
import { Send, Paperclip, Check, CheckDouble, File } from 'lucide-react';

/**
 * TrainerChatPage - Real-time messaging with trainer (Socket.io powered)
 */
const TrainerChatPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const messagesEndRef = useRef(null);

  // Mock trainers for chat selection
  const trainers = [
    {
      id: 1,
      name: 'Alex Martinez',
      avatar: 'https://via.placeholder.com/48?text=AM',
      status: 'online',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/48?text=SJ',
      status: 'offline',
    },
    {
      id: 3,
      name: 'Mike Thompson',
      avatar: 'https://via.placeholder.com/48?text=MT',
      status: 'online',
    },
  ];

  // State
  const [selectedTrainerID, setSelectedTrainerID] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      trainerId: 1,
      sender: 'trainer',
      text: 'Hi! How are you feeling after yesterday\'s session?',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      attachments: [],
    },
    {
      id: 2,
      trainerId: 1,
      sender: 'member',
      text: 'Great! A bit sore in the legs but feeling strong overall.',
      timestamp: new Date(Date.now() - 3500000),
      read: true,
      attachments: [],
    },
    {
      id: 3,
      trainerId: 1,
      sender: 'trainer',
      text: 'Perfect! I\'ve uploaded your workout plan for next session.',
      timestamp: new Date(Date.now() - 3000000),
      read: true,
      attachments: [
        {
          id: 1,
          name: 'Workout_Plan_Week_4.pdf',
          type: 'application/pdf',
          size: '2.4 MB',
        },
      ],
    },
    {
      id: 4,
      trainerId: 1,
      sender: 'member',
      text: 'Thanks! I\'ll check it out.',
      timestamp: new Date(Date.now() - 2800000),
      read: true,
      attachments: [],
    },
  ]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedTrainer = trainers.find((t) => t.id === selectedTrainerID);
  const trainerMessages = messages.filter((m) => m.trainerId === selectedTrainerID);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [trainerMessages]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newMessage = {
      id: messages.length + 1,
      trainerId: selectedTrainerID,
      sender: 'member',
      text: messageText,
      timestamp: new Date(),
      read: true,
      attachments: [],
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    setIsLoading(false);

    // Simulate trainer response
    setTimeout(() => {
      const trainerResponse = {
        id: messages.length + 2,
        trainerId: selectedTrainerID,
        sender: 'trainer',
        text: 'Thanks for the update! See you at our next session.',
        timestamp: new Date(),
        read: false,
        attachments: [],
      };
      setMessages((prev) => [...prev, trainerResponse]);
    }, 1000);
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('member.chat.today') || 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('member.chat.yesterday') || 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <SEO
        title="Trainer Chat - CrunchFit Pro"
        description="Message your personal trainer"
        noIndex={true}
      />

      <MemberLayout>
        <div
          className={`h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        >
          {/* Trainer List Sidebar */}
          <div
            className={`w-64 border-r flex flex-col ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b" style={{
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }}>
              <h2
                className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.chat.messages') || 'Messages'}
              </h2>
            </div>

            {/* Trainer List */}
            <div className="flex-1 overflow-y-auto">
              {trainers.map((trainer) => (
                <button
                  key={trainer.id}
                  onClick={() => setSelectedTrainerID(trainer.id)}
                  className={`w-full p-4 flex items-center gap-3 transition-colors text-left ${
                    selectedTrainerID === trainer.id
                      ? isDark
                        ? 'bg-accent/10 border-l-4 border-accent'
                        : 'bg-accent/10 border-l-4 border-accent'
                      : isDark
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={trainer.avatar}
                      alt={trainer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                        trainer.status === 'online'
                          ? 'bg-green-500 border-white'
                          : 'bg-gray-400 border-white'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {trainer.name}
                    </p>
                    <p
                      className={`text-xs ${
                        trainer.status === 'online'
                          ? isDark
                            ? 'text-green-400'
                            : 'text-green-600'
                          : isDark
                            ? 'text-gray-500'
                            : 'text-gray-500'
                      }`}
                    >
                      {trainer.status === 'online'
                        ? t('member.chat.online') || 'Online'
                        : t('member.chat.offline') || 'Offline'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={selectedTrainer.avatar}
                  alt={selectedTrainer.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3
                    className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {selectedTrainer.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      selectedTrainer.status === 'online'
                        ? isDark
                          ? 'text-green-400'
                          : 'text-green-600'
                        : isDark
                          ? 'text-gray-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {selectedTrainer.status === 'online'
                      ? t('member.chat.online') || 'Online'
                      : t('member.chat.offline') || 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                isDark ? 'bg-gray-900' : 'bg-gray-50'
              }`}
            >
              {trainerMessages.map((message, index) => {
                const prevMessage = index > 0 ? trainerMessages[index - 1] : null;
                const showDate =
                  !prevMessage ||
                  formatDate(message.timestamp) !==
                    formatDate(prevMessage.timestamp);

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            isDark
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender === 'member'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          message.sender === 'member' ? 'items-end' : 'items-start'
                        } flex flex-col gap-1`}
                      >
                        {/* Attachments */}
                        {message.attachments.length > 0 && (
                          <div className="space-y-2 mb-1">
                            {message.attachments.map((file) => (
                              <a
                                key={file.id}
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  toast.success('Download: ' + file.name);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                                  message.sender === 'member'
                                    ? isDark
                                      ? 'bg-accent/20 text-accent hover:bg-accent/30'
                                      : 'bg-accent/10 text-accent hover:bg-accent/20'
                                    : isDark
                                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                <File className="w-4 h-4" />
                                {file.name}
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.sender === 'member'
                              ? 'bg-accent text-white rounded-br-none'
                              : isDark
                                ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="break-words">{message.text}</p>
                        </div>

                        {/* Timestamp and Read Receipt */}
                        <div
                          className={`flex items-center gap-1 text-xs px-1 ${
                            message.sender === 'member'
                              ? isDark
                                ? 'text-gray-500'
                                : 'text-gray-500'
                              : isDark
                                ? 'text-gray-500'
                                : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                          {message.sender === 'member' && (
                            message.read ? (
                              <CheckDouble className="w-3 h-3 text-accent" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div
              className={`p-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex gap-2">
                <button
                  className={`p-3 rounded-lg transition-all ${
                    isDark
                      ? 'hover:bg-gray-800 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  title={t('member.chat.attachFile') || 'Attach file'}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    t('member.chat.typeMesasge') || 'Type your message...'
                  }
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || isLoading}
                  className={`p-3 rounded-lg text-white transition-all ${
                    !messageText.trim() || isLoading
                      ? 'bg-accent/50 cursor-not-allowed'
                      : 'bg-accent hover:bg-accent/90 active:scale-95'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </MemberLayout>
    </>
  );
};

export default TrainerChatPage;
