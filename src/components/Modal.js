import React from 'react';
import { useModal } from '../contexts/ModalContext';

const Modal = () => {
  const { isOpen, title, content, footer, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full">
        <div className="p-6 border-b dark:border-dark-border flex justify-between items-center">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={closeModal}
            className="text-2xl font-bold p-1 leading-none rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        
        {footer && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-dark-border rounded-b-xl flex justify-end gap-3">
            <div dangerouslySetInnerHTML={{ __html: footer }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

