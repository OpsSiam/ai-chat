import React, { useState } from 'react';
import axios from 'axios';
import '../style/FileUpload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function FileUpload({ sessionId, addMessage, setSessionId, updateLastMessage, onNewSessionCreated }) {
  const [isSending, setIsSending] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const supportedFileTypes = [
    'text/plain',
    'application/json',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/xml',
    'text/xml',
    'text/html',
    'application/rtf',
    'text/markdown',
    'application/x-yaml',
    'text/yaml',
    'application/javascript',
    'text/javascript',
    'application/sql',
    'text/x-sql',
    'text/x-python',
    'application/x-python-code',
  ];

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files).slice(0, 3); 
    setFilesToUpload(files); 
    setIsModalOpen(true); 
  };

  const handleConfirmUpload = () => {
    setIsModalOpen(false); 
    handleFileUpload(); 
  };

  const handleFileUpload = async () => {
    let currentSessionId = sessionId;

    if (filesToUpload.length > 0) {
      const unsupportedFiles = filesToUpload.filter(file => !supportedFileTypes.includes(file.type));
      if (unsupportedFiles.length > 0) {
        addMessage({
          role: 'assistant',
          content: `Some files are not supported: ${unsupportedFiles.map(file => file.name).join(', ')}. Supported types are text, JSON, PDF, and similar.`,
        });
        return;
      }

      const fileMessages = filesToUpload.map(file => `Uploaded file: ${file.name}`).join('\n');
      const userMessage = {
        role: 'user',
        content: fileMessages,
      };
      addMessage(userMessage);

      if (!currentSessionId) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/sessions`, {
            title: `Uploaded file: ${filesToUpload[0].name}`,
          });
          currentSessionId = response.data.id;
          setSessionId(currentSessionId);
          onNewSessionCreated(response.data);
        } catch (error) {
          console.error('Error creating session:', error);
          return;
        }
      }

      setIsSending(true);
      const combinedMessages = [];

      for (const file of filesToUpload) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileContent = e.target.result;
          const combinedMessage = `Uploaded file: ${file.name}\n\nFile Content:\n${fileContent}\n\n`;

          combinedMessages.push(combinedMessage);

          if (combinedMessages.length === filesToUpload.length) {
            let assistantContent = '';
            addMessage({ role: 'assistant', content: assistantContent });

            try {
              const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  messages: combinedMessages.map(content => ({ role: 'user', content })),
                  sessionId: currentSessionId,
                }),
              });

              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

              const reader = response.body.getReader();
              const decoder = new TextDecoder('utf-8');

              while (true) {
                const { value, done } = await reader.read();
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
              console.error('Error sending file content:', error);
            } finally {
              setIsSending(false);
            }
          }
        };

        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-upload-input" className="file-upload-label">
        <FontAwesomeIcon icon={faPaperclip} className="file-upload-icon" />
      </label>
      <input
        id="file-upload-input"
        type="file"
        onChange={handleFileSelection}
        disabled={isSending}
        className="file-upload-input"
        multiple
        accept={supportedFileTypes.join(', ')}
      />

      {/* Modal for confirming file upload */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpload}
        fileNames={filesToUpload.map(file => file.name)} 
        type="upload" 
      />
    </div>
  );
}

export default FileUpload;
