import React, { useState } from 'react';
import '../styles/ChatBotComponent.css';  // Import your chatbot styles

const ChatBotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);  // Control whether the chatbot is expanded

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');

      // Simulate a bot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: 'Hello! How can I assist you today?', sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChatBot = () => {
    setIsOpen(!isOpen);  // Toggle the chatbot visibility
  };

  return (
    <div>
      {/* Display chatbot logo, click to expand the chatbox */}
      <div className="chatbot-toggle" onClick={toggleChatBot}>
        <img src="/photo/chatbot-logo.png" alt="ChatBot Logo" className="chatbot-logo" />
      </div>

      {/* Display the chatbox only when isOpen is true */}
      {isOpen && (
        <div className="chatbot-container">
          <h2>ChatBot</h2>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotComponent;
