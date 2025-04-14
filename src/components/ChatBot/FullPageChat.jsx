import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash, FaRobot, FaPaperPlane, FaFileAudio } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FullPageChat = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            text: "Hi, how can I help you access information about polio?",
            isBot: true,
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const messagesEndRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    // Initialize media recorder
    useEffect(() => {
        const initializeMediaRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);

                mediaRecorder.current.ondataavailable = (e) => {
                    audioChunks.current.push(e.data);
                };

                mediaRecorder.current.onstop = () => {
                    const blob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
                    setAudioBlob(blob);
                    audioChunks.current = [];
                };
            } catch (err) {
                setError('Microphone access denied. Please enable microphone permissions.');
            }
        };

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            initializeMediaRecorder();
        } else {
            setError('Audio recording not supported in this browser');
        }
    }, []);

    const startRecording = () => {
        if (mediaRecorder.current) {
            setIsRecording(true);
            mediaRecorder.current.start();
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleVoiceInput = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };


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


    const MessageBubble = ({ msg }) => (
        <div className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] rounded-xl p-4 shadow-md ${msg.isBot ? 'bg-gray-200 text-gray-900' : 'bg-green-600 text-white'
                }`}>
                {msg.isAudio ? (
                    <div className="flex items-center gap-3">
                        <FaFileAudio className="text-xl" />
                        <audio controls className="max-w-full">
                            <source src={URL.createObjectURL(msg.audio)} type="audio/mpeg" />
                            Your browser does not support audio playback
                        </audio>
                    </div>
                ) : (
                    <p className="text-base">{msg.text}</p>
                )}
                <span className="text-xs opacity-70 mt-2 block text-right">
                    {msg.timestamp}
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 pt-24 md:pt-20">
            {/* Chat Header */}
            <header className="bg-gradient-to-r from-green-700 to-green-600 text-white p-5 shadow-xl w-full">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="hover:text-gray-300 transition-colors text-lg"
                        >
                            ← Back
                        </button>
                        <FaRobot className="text-3xl" />
                        <h1 className="text-2xl font-semibold">Polio Information Assistant</h1>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="max-w-6xl mx-auto p-6 h-screen overflow-auto">
                <div className="bg-gray-100 rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} msg={msg} />
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-900 rounded-xl p-4 shadow-md">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="border-t border-gray-300 p-4 bg-white">
                        <div className="flex space-x-4 items-center">
                            {/* Voice Icon Button */}
                            <button
                                onClick={toggleVoiceInput}
                                type="button"
                                className={`p-3 rounded-full transition-colors shadow-md ${isRecording ? 'bg-red-500' : 'bg-green-600 text-white'
                                    } hover:bg-green-700`}
                                disabled={!mediaRecorder.current}
                            >
                                {isRecording ? (
                                    <FaMicrophoneSlash className="text-xl" />
                                ) : (
                                    <FaMicrophone className="text-xl" />
                                )}
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type or record a message..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-900"
                                disabled={isLoading || isRecording}
                            />
                            <button
                                type="submit"
                                className="bg-green-600 text-white rounded-full px-6 py-3 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-md"
                                disabled={isLoading || (!message && !audioBlob)}
                            >
                                <FaPaperPlane />
                                <span>Send</span>
                            </button>
                        </div>
                        {audioBlob && (
                            <div className="mt-3 text-sm text-gray-700 flex items-center gap-3">
                                <FaFileAudio className="text-xl" />
                                <span>Audio recording ready to send</span>
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FullPageChat;
