
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../style/Message.css';
import { PiOpenAiLogoThin } from 'react-icons/pi';
import remarkGfm from 'remark-gfm';
import { PiCopySimple } from "react-icons/pi";

function Message({ message }) {
  const [copyStatus, setCopyStatus] = useState({});

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus((prevState) => ({ ...prevState, [index]: true }));
      setTimeout(() => {
        setCopyStatus((prevState) => ({ ...prevState, [index]: false }));
      }, 2000);
    }).catch((err) => {
      console.error("Failed to copy code: ", err);
    });
  };

  const formatMessage = (content, role) => {
    
    if (role === 'user') {
      return (
        <ReactMarkdown
          key="user-message"
          children={content}
          remarkPlugins={[remarkGfm]} 
          components={{
            
            p: ({ children }) => <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{children}</p>,
          }}
        />
      );
    }

    
    const parts = content.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        let codeBlock = part.slice(3, -3).trim();
        const languageMatch = codeBlock.match(/^(\w+)\n/);
        let language = '';
        let code = codeBlock;

        if (languageMatch) {
          language = languageMatch[1];
          code = codeBlock.replace(languageMatch[0], '').trim();
        }

        return (
          <div key={index} className="code-snippet-container">
            <div className="code-header">
              {language && <div className="code-language-title">{language}</div>}
              {copyStatus[index] ? (
                <div className="copy-status">
                  <span className="copy-icon">✔</span> Copied!
                </div>
              ) : (
                <button className="copy-button" onClick={() => handleCopy(code, index)}>
                  <PiCopySimple size={16} className="copy-icon" /> Copy code
                </button>
              )}
            </div>
            <pre className={`code-block language-${language}`}>
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        return (
          <ReactMarkdown
            key={index}
            children={part}
            remarkPlugins={[remarkGfm]} 
            components={{
              table: ({ children }) => (
                <div className="table-container">
                  <table>{children}</table>
                </div>
              ),
              p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
            }}
          />
        );
      }
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        {message.role === 'assistant' && (
          <div className="message-header">
            <PiOpenAiLogoThin className="assistant-logo" />
            <div className="assistant-response">
              {formatMessage(message.content, message.role)}
            </div>
          </div>
        )}
        {message.role !== 'assistant' && formatMessage(message.content, message.role)}
      </div>
    </div>
  );
}

export default Message;
