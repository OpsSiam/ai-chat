import React, { useEffect, useRef } from 'react';
import Message from './Message';
import '../style/ChatWindow.css';

function ChatWindow({ messages, apiStatus }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!apiStatus) {
    return (
      <div className="chat-window">
        <p className="status-message">Unable to connect to the API. Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatWindow;
