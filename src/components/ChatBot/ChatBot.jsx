// Create a new component: src/components/ChatBot/ChatBot.jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { BsFillChatDotsFill } from 'react-icons/bs';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Update handleSubmit function to send conversation history
    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!message.trim() && !audioBlob) || isLoading) return;

        // Create temporary message objects
        const tempUserMessage = {
            text: audioBlob ? 'Voice message' : message,
            isBot: false,
            isAudio: !!audioBlob,
            audio: audioBlob,
            timestamp: new Date().toLocaleTimeString(),
        };

        // Create temporary array with new message
        const tempMessages = [...messages, tempUserMessage];

        const payload = {
            question: audioBlob ? 'Voice message' : message,
            history: tempMessages
                .filter(msg => !msg.isBot) // Only include user messages
                .slice(-4) // Last 2 questions (assuming 2 messages per exchange)
                .map(msg => msg.text)
        };

        // For voice messages, add the audio blob
        const formData = new FormData();
        let endpoint = 'https://polio-chatbot-backend.onrender.com/chatbot/api';
        let config = {};

        if (audioBlob) {
            formData.append('audio', audioBlob, 'recording.mp3');
            formData.append('history', JSON.stringify(payload.history));
            endpoint = 'https://polio-chatbot-backend.onrender.com/chatbot/voice/api';
            config = { headers: { 'Content-Type': 'multipart/form-data' } };
        } else {
            config = {
                headers: { 'Content-Type': 'application/json' },
                data: payload
            };
        }

        setIsLoading(true);

        try {
            const response = await axios.post(endpoint, audioBlob ? formData : payload, config);

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
            setAudioBlob(null);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen ? (
                <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300">
                    {/* Chat Header */}
                    <div className="bg-[#53AD49] rounded-t-xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaRobot className="text-white text-xl" />
                            <h2 className="text-white font-semibold">Polio Assistant</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${msg.isBot
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-[#53AD49] text-white'
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
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
                    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53AD49]"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-[#53AD49] text-white rounded-lg p-2 hover:bg-[#45963d] transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <FaPaperPlane className="text-lg" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#53AD49] text-white p-4 rounded-full shadow-lg hover:bg-[#45963d] hover:scale-105 transition-all duration-300 animate-bounce"
                >
                    <BsFillChatDotsFill className="text-2xl" />
                </button>
            )}
        </div>
    );
};

export default ChatBot;