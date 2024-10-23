import React, { useState, useRef, useEffect } from 'react';
import '../style/Sidebar.css';
import Modal from './Modal'; 
import { format, isToday, isYesterday, subDays } from 'date-fns'; 
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';

function Sidebar({ sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession, onRenameSession, isOpen, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(null); 
  const [isRenaming, setIsRenaming] = useState(null); 
  const [renameValue, setRenameValue] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [sessionToDelete, setSessionToDelete] = useState(null); 
  const dropdownRef = useRef(null); 

  const handleRenameSession = async (sessionId) => {
    if (renameValue.trim()) {
      await onRenameSession(sessionId, renameValue); 
    }
    setIsRenaming(null); 
    setDropdownOpen(null); 
  };

  const openDeleteModal = (session) => {
    setSessionToDelete(session);
    setModalOpen(true);
  };

  const confirmDeleteSession = () => {
    onDeleteSession(sessionToDelete.id);
    setModalOpen(false);
    setDropdownOpen(null);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(null); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const groupSessionsByTime = (sessions) => {
    const now = new Date();
    const yesterday = subDays(now, 1);
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);

    return {
      today: sessions.filter(session => isToday(new Date(session.created_at))),
      yesterday: sessions.filter(session => isYesterday(new Date(session.created_at))),
      previousSevenDays: sessions.filter(session => new Date(session.created_at) >= sevenDaysAgo && !isToday(new Date(session.created_at)) && !isYesterday(new Date(session.created_at))),
      previousThirtyDays: sessions.filter(session => new Date(session.created_at) >= thirtyDaysAgo && new Date(session.created_at) < sevenDaysAgo),
      older: sessions.filter(session => new Date(session.created_at) < thirtyDaysAgo),
    };
  };

  const { today, yesterday, previousSevenDays, previousThirtyDays, older } = groupSessionsByTime(sessions);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}> 
        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
          ☰
        </button>

        <h2>Conversations</h2>
        <button className="new-conversation-button" onClick={onNewSession}>
          New Chat
        </button>

        <ul className="session-list">
          {/* Today's Sessions */}
          {today.length > 0 && (
            <>
              <li className="time-period-today">Today</li>
              {today.map((session, index) => (
                <li
                  key={session.id}
                  className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  {isRenaming === session.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSession(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSession(session.id);
                      }}
                    />
                  ) : (
                    <span className="session-title">
                      {session.title || `Conversation ${index + 1}`}
                    </span>
                  )}
                  <span
                    className="session-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                    }}
                  >
                    <span className="three-dots">•••</span>
                  </span>
                  {dropdownOpen === session.id && (
                    <div className="dropdown" ref={dropdownRef}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(session.id);
                          setRenameValue(session.title);
                          setDropdownOpen(null);
                        }}
                      >
                        <FaEdit className="icon" /> Rename
                      </div>
                      <div onClick={() => openDeleteModal(session)}>
                        <FaTrash className="icon" /> Delete
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}

          {/* Yesterday's Sessions */}
          {yesterday.length > 0 && (
            <>
              <li className="time-period">Yesterday</li>
              {yesterday.map((session, index) => (
                <li
                  key={session.id}
                  className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  {isRenaming === session.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSession(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSession(session.id);
                      }}
                    />
                  ) : (
                    <span className="session-title">
                      {session.title || `Conversation ${index + 1}`}
                    </span>
                  )}
                  <span
                    className="session-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                    }}
                  >
                    <span className="three-dots">•••</span>
                  </span>
                  {dropdownOpen === session.id && (
                    <div className="dropdown" ref={dropdownRef}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(session.id);
                          setRenameValue(session.title);
                          setDropdownOpen(null);
                        }}
                      >
                        <FaEdit className="icon" /> Rename
                      </div>
                      <div onClick={() => openDeleteModal(session)}>
                        <FaTrash className="icon" /> Delete
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}

          {/* Previous 7 Days Sessions */}
          {previousSevenDays.length > 0 && (
            <>
              <li className="time-period">Previous 7 Days</li>
              {previousSevenDays.map((session, index) => (
                <li
                  key={session.id}
                  className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  {isRenaming === session.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSession(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSession(session.id);
                      }}
                    />
                  ) : (
                    <span className="session-title">
                      {session.title || `Conversation ${index + 1}`}
                    </span>
                  )}
                  <span
                    className="session-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                    }}
                  >
                    <span className="three-dots">•••</span>
                  </span>
                  {dropdownOpen === session.id && (
                    <div className="dropdown" ref={dropdownRef}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(session.id);
                          setRenameValue(session.title);
                          setDropdownOpen(null);
                        }}
                      >
                        <FaEdit className="icon" /> Rename
                      </div>
                      <div onClick={() => openDeleteModal(session)}>
                        <FaTrash className="icon" /> Delete
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}

          {/* Previous 30 Days Sessions */}
          {previousThirtyDays.length > 0 && (
            <>
              <li className="time-period">Previous 30 Days</li>
              {previousThirtyDays.map((session, index) => (
                <li
                  key={session.id}
                  className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  {isRenaming === session.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSession(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSession(session.id);
                      }}
                    />
                  ) : (
                    <span className="session-title">
                      {session.title || `Conversation ${index + 1}`}
                    </span>
                  )}
                  <span
                    className="session-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                    }}
                  >
                    <span className="three-dots">•••</span>
                  </span>
                  {dropdownOpen === session.id && (
                    <div className="dropdown" ref={dropdownRef}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(session.id);
                          setRenameValue(session.title);
                          setDropdownOpen(null);
                        }}
                      >
                        <FaEdit className="icon" /> Rename
                      </div>
                      <div onClick={() => openDeleteModal(session)}>
                        <FaTrash className="icon" /> Delete
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}

          {/* Older Sessions */}
          {older.length > 0 && (
            <>
              <li className="time-period">Older</li>
              {older.map((session, index) => (
                <li
                  key={session.id}
                  className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  {isRenaming === session.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSession(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSession(session.id);
                      }}
                    />
                  ) : (
                    <span className="session-title">
                      {session.title || `Conversation ${index + 1}`}
                    </span>
                  )}
                  <span
                    className="session-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                    }}
                  >
                    <span className="three-dots">•••</span>
                  </span>
                  {dropdownOpen === session.id && (
                    <div className="dropdown" ref={dropdownRef}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(session.id);
                          setRenameValue(session.title);
                          setDropdownOpen(null);
                        }}
                      >
                        <FaEdit className="icon" /> Rename
                      </div>
                      <div onClick={() => openDeleteModal(session)}>
                        <FaTrash className="icon" /> Delete
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmDeleteSession}
          sessionName={sessionToDelete ? sessionToDelete.title : ''}
        />
      )}
    </>
  );
}

export default Sidebar;
