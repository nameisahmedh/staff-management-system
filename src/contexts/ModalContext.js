import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [footer, setFooter] = useState('');
  const [onClose, setOnClose] = useState(null);

  const openModal = (modalTitle, modalContent, modalFooter = '', closeCallback = null) => {
    setTitle(modalTitle);
    setContent(modalContent);
    setFooter(modalFooter);
    setOnClose(() => closeCallback);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
      setOnClose(null);
    }
    // Reset content after animation
    setTimeout(() => {
      setTitle('');
      setContent('');
      setFooter('');
    }, 300);
  };

  const value = {
    isOpen,
    title,
    content,
    footer,
    openModal,
    closeModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

