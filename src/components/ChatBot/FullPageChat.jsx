import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash, FaRobot, FaPaperPlane, FaFileAudio } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FullPageChat = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
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



    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!message.trim() && !audioBlob) || isLoading) return;
    
        const formData = new FormData();
        let endpoint = 'http://127.0.0.1:5000/chatbot/api';
        let config = {};
    
        if (audioBlob) {
            formData.append('audio', audioBlob, 'recording.mp3');
            endpoint = 'http://127.0.0.1:5000/chatbot/voice/api';
            config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
        } else {
            config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    question: message
                }
            };
        }
    
        setIsLoading(true);
        
        try {
            const response = await axios.post(endpoint, audioBlob ? formData : { question: message }, config);
    
            const userMessage = {
                text: audioBlob ? 'Voice message' : message,
                isBot: false,
                isAudio: !!audioBlob,
                audio: audioBlob,
                timestamp: new Date().toLocaleTimeString(),
            };
    
            const botMessage = {
                text: response.data.response,
                isBot: true,
                timestamp: new Date().toLocaleTimeString(),
            };
    
            setMessages(prev => [...prev, userMessage, botMessage]);
            
        } catch (error) {
            setMessages(prev => [...prev, {
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
            <div className={`max-w-[70%] rounded-lg p-3 ${
                msg.isBot ? 'bg-gray-100 text-gray-800' : 'bg-[#53AD49] text-white'
            }`}>
                {msg.isAudio ? (
                    <div className="flex items-center gap-2">
                        <FaFileAudio className="text-lg" />
                        <audio controls className="max-w-full">
                            <source src={URL.createObjectURL(msg.audio)} type="audio/mpeg" />
                            Your browser does not support audio playback
                        </audio>
                    </div>
                ) : (
                    <p className="text-sm">{msg.text}</p>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp}
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Chat Header */}
            <header className="bg-[#53AD49] text-white p-4 shadow-md fixed w-full top-0 z-10">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="hover:text-gray-200 transition-colors"
                        >
                            ← Back
                        </button>
                        <FaRobot className="text-2xl" />
                        <h1 className="text-xl font-bold">Polio Information Assistant</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleVoiceInput}
                            className={`p-2 rounded-full ${
                                isRecording ? 'bg-red-500' : 'bg-white/20'
                            } hover:bg-white/30 transition-colors`}
                            disabled={!mediaRecorder.current}
                        >
                            {isRecording ? (
                                <FaMicrophoneSlash className="text-xl" />
                            ) : (
                                <FaMicrophone className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="max-w-6xl mx-auto p-4 pt-20 h-screen">
                <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} msg={msg} />
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
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSubmit}
                        className="border-t border-gray-200 p-4"
                    >
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type or record a message..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#53AD49]"
                                disabled={isLoading || isRecording}
                            />
                            <button
                                type="submit"
                                className="bg-[#53AD49] text-white rounded-lg px-6 py-2 hover:bg-[#45963d] transition-colors disabled:opacity-50 flex items-center space-x-2"
                                disabled={isLoading || (!message && !audioBlob)}
                            >
                                <FaPaperPlane />
                                <span>Send</span>
                            </button>
                        </div>
                        {audioBlob && (
                            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                                <FaFileAudio />
                                Audio recording ready to send
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FullPageChat;