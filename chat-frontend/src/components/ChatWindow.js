import React, { useEffect, useRef } from 'react';
import Message from './Message';
import '../style/ChatWindow.css';

function ChatWindow({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
