import React, { useState } from 'react';
import '../styles/ChatBotComponent.css';  // Import styles

const ChatBotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);  // Control whether the chatbot is expanded

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Display the user's message
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      const userMessage = inputValue;
      setInputValue('');

      // Send request to the backend
      try {
        const response = await fetch("http://127.0.0.1:8000/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        const botMessage = data.response;

        // Display the bot's response
        setMessages(prevMessages => [...prevMessages, { text: botMessage, sender: 'bot' }]);
      } catch (error) {
        console.error("Error:", error);
      }
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
    setIsOpen(!isOpen);  // Toggle the chatbot open/close state
  };

  return (
    <div>
      {/* Display the chatbot logo, clicking on it expands the chat window */}
      <div className="chatbot-toggle" onClick={toggleChatBot}>
        <img src="/photo/chatbot-logo.png" alt="ChatBot Logo" className="chatbot-logo" />
      </div>

      {/* Show the chat window when isOpen is true */}
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
