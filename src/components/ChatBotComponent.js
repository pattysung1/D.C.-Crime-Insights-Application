import React, { useState } from 'react';
import '../styles/ChatBotComponent.css';  // 引入樣式

const ChatBotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);  // 控制 chat bot 是否展開

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // 顯示用戶的訊息
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      const userMessage = inputValue;
      setInputValue('');

      // 發送請求到後端
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

        // 顯示機器人的回應
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
    setIsOpen(!isOpen);  // 切換 chat bot 的開關
  };

  return (
    <div>
      {/* 展示 chat bot 的 logo，點擊後展開對話框 */}
      <div className="chatbot-toggle" onClick={toggleChatBot}>
        <img src="/photo/chatbot-logo.png" alt="ChatBot Logo" className="chatbot-logo" />
      </div>

      {/* 當 isOpen 為 true 時顯示對話框 */}
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
