import { useState } from 'react';
import axios from 'axios';
import { FaComments, FaTimes } from 'react-icons/fa';
import '../css/ChatWidget.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        try {
            setIsLoading(true);
            // Add user message to chat
            const userMessage = { role: 'user', content: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');

            // Send to backend
            const response = await axios.post('http://localhost:8080/api/chat', {
                message: input
            }, {
                withCredentials: true
            });

            // Add AI response to chat
            const aiMessage = { role: 'assistant', content: response.data.message };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'error',
                content: 'Sorry, there was an error processing your message.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                className="chat-widget-button"
                onClick={() => setIsOpen(true)}
            >
                <FaComments />
                <span>Chat with ByteBites AI</span>
            </button>
        );
    }

    return (
        <div className="chat-widget">
            <div className="chat-header">
                <h3>ByteBites AI Assistant</h3>
                <button 
                    className="close-button"
                    onClick={() => setIsOpen(false)}
                >
                    <FaTimes />
                </button>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        Hello! 👋 I'm your ByteBites AI assistant. How can I help you today?
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message assistant">
                        <div className="loading-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                    onClick={sendMessage} 
                    disabled={isLoading || !input.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWidget; 