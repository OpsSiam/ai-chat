import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';

function ChatApp() {
  const [apiStatus, setApiStatus] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ping`);
        if (response.ok) {
          setApiStatus(true);
        } else {
          setApiStatus(false);
        }
      } catch (error) {
        console.error('Error connecting to backend:', error);
        setApiStatus(false);
      }
    };

    checkBackendStatus();
  }, []);

  if (apiStatus === null) {
    return (
      <div className="status-container">
        <p>Checking backend connection...</p>
      </div>
    );
  }

  return <ChatWindow messages={messages} apiStatus={apiStatus} />;
}

export default ChatApp;
