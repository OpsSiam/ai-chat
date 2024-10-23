import React, { useState, useRef } from 'react';
import '../style/MessageInput.css';
import FileUpload from './FileUpload';
import { BsPaperclip } from 'react-icons/bs';
import { FaArrowUp } from 'react-icons/fa';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const sendMessage = async ({
  content,
  providedSessionId,
  sessionId,
  setSessionId,
  addMessage,
  updateLastMessage,
  messages,
  onNewSessionCreated, 
}) => {
  if (content.trim() === '') return;

  let currentSessionId = providedSessionId || sessionId;

  
  if (!currentSessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: content }), 
      });
      const sessionData = await response.json();
      currentSessionId = sessionData.id;
      setSessionId(currentSessionId); 
      onNewSessionCreated(sessionData); 
    } catch (error) {
      console.error('Error creating session:', error);
      return;
    }
  }

  const userMessage = { role: 'user', content };
  addMessage(userMessage); 

  let assistantContent = '';
  addMessage({ role: 'assistant', content: assistantContent });

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, userMessage],
        sessionId: currentSessionId,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (let line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.replace('data: ', '').trim();

          if (dataStr === '[DONE]') break;

          try {
            const data = JSON.parse(dataStr);
            const delta = data.content;

            if (delta) {
              assistantContent += delta;
              updateLastMessage(assistantContent);
            }
          } catch (e) {
            console.error('Error parsing data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during message streaming:', error);
  }
};

function MessageInput({
  addMessage,
  updateLastMessage,
  sessionId,
  setSessionId,
  messages,
  onNewSessionCreated,
}) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const messageToSend = input; 
      setInput(''); 
      resetTextarea(); 

      setIsSending(true);
      await sendMessage({
        content: messageToSend, 
        sessionId,
        setSessionId,
        addMessage,
        updateLastMessage,
        messages,
        onNewSessionCreated, 
      });
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    expandTextarea();
  };

  const expandTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = '18px'; 
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; 
    }
  };

  const resetTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = '18px'; 
    }
  };

  return (
    <div className="message-input-wrapper">
      <div className="message-input-container">
        <div className="file-upload-wrapper">
          <FileUpload
            sessionId={sessionId}
            addMessage={addMessage}
            setSessionId={setSessionId}
            updateLastMessage={updateLastMessage}
            onNewSessionCreated={onNewSessionCreated}
            disabled={isSending}
          >
            <BsPaperclip size={20} className="file-upload-icon" />
          </FileUpload>
        </div>
        <textarea
          rows="1"
          ref={inputRef}
          className="message-input"
          value={input}
          onChange={handleInputChange}
          placeholder="Message Azure OpenAI"
          disabled={isSending}
          onKeyDown={handleKeyDown}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={isSending || input.trim() === ''}
        >
          <FaArrowUp size={16} />
        </button>
      </div>
      <div className="note">Azure OpenAI can make mistakes.</div>
    </div>
  );
}

export default MessageInput;
