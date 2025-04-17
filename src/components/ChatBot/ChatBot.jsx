



import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { BsFillChatDotsFill } from 'react-icons/bs';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const tempUserMessage = {
            text: message,
            isBot: false,
            timestamp: new Date().toLocaleTimeString(),
        };

        const tempMessages = [...messages, tempUserMessage];

        const payload = {
            question: message,
            history: tempMessages
                .filter(msg => !msg.isBot)
                .slice(-4)
                .map(msg => msg.text)
        };

        setIsLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:5000/chatbot/api', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            const botMessage = {
                text: response.data.response,
                isBot: true,
                timestamp: new Date().toLocaleTimeString(),
            };

            setMessages(prev => [...prev, tempUserMessage, botMessage]);

        } catch (error) {
            setMessages(prev => [...prev, tempUserMessage, {
                text: 'Error sending message. Please try again.',
                isBot: true,
                timestamp: new Date().toLocaleTimeString(),
            }]);
        } finally {
            setMessage('');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
            {isOpen ? (
                <div className="w-full max-w-[100vw] sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 mx-2 sm:mx-0">
                    {/* Chat Header */}
                    <div className="bg-[#53AD49] rounded-t-xl p-3 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <FaRobot className="text-white text-lg sm:text-xl" />
                            <h2 className="text-white font-semibold text-sm sm:text-base">Polio Assistant</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <FaTimes className="text-lg sm:text-xl" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-[60vh] max-h-[400px] sm:h-96 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-2 sm:p-3 ${msg.isBot
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-[#53AD49] text-white'
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm break-words">{msg.text}</p>
                                    <span className="text-[10px] sm:text-xs opacity-70 mt-1 block">
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-2 sm:p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 sm:p-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#53AD49]"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-[#53AD49] text-white rounded-lg p-2 hover:bg-[#45963d] transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <FaPaperPlane className="text-lg sm:text-xl" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#53AD49] text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-[#45963d] hover:scale-105 transition-all duration-300"
                >
                    <BsFillChatDotsFill className="text-xl sm:text-2xl" />
                </button>
            )}
        </div>
    );
};

export default ChatBot;