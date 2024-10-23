import React from 'react';
import '../style/Modal.css';

function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  sessionName = '',
  fileNames = [],
  type = 'delete',  
}) {
  if (!isOpen) return null; 

  
  const isFileUpload = type === 'upload';

  let modalTitle = 'Delete chat?';
  let modalMessage = `This will delete <strong>${sessionName}</strong>.`;
  let confirmText = 'Delete';

  
  if (isFileUpload) {
    modalTitle = 'Upload Files?';
    modalMessage = `Are you sure you want to upload the following files? <br/><strong>${fileNames.join(', ')}</strong>`;
    confirmText = 'Upload';
  }

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isFileUpload ? 'modal-file-upload' : ''}`}>
        <h2>{modalTitle}</h2>
        <p dangerouslySetInnerHTML={{ __html: modalMessage }} />
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className={`modal-confirm ${isFileUpload ? 'modal-confirm' : 'modal-delete'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
