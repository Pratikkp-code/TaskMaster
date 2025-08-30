"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const customStyles = {
  content: {
    backgroundColor: '#1B263B',
    border: '1px solid #3B546B',
    borderRadius: '12px',
    color: 'white',
    width: '90%',
    maxWidth: '500px',
    padding: '24px',
  },
  overlay: {
    backgroundColor: 'rgba(13, 27, 42, 0.9)',
  },
};

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function TaskModal({ isOpen, onRequestClose, onTaskCreate, initialDate }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialDate) {
      setDueDate(new Date(initialDate));
    }

    setErrorMessage('');
  }, [initialDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      setErrorMessage('Please provide a title and a due date.');
      return;
    }
    setErrorMessage('');
    onTaskCreate(title, dueDate.toISOString());
    onRequestClose();
    setTitle('');
    setDueDate(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add New Task"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Add a Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-400">Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a name for this card"
            className="w-full p-2 rounded-lg bg-[#243555] border-2 border-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-400">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            className="w-full p-2 rounded-lg bg-[#243555] border-2 border-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 bg-[#243555] rounded-lg text-white hover:bg-[#3B546B] transition-colors transform active:scale-95">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-cyan-600 rounded-lg text-white font-semibold hover:bg-cyan-700 transition-colors transform active:scale-95">
            Add Card
          </button>
        </div>
      </form>
    </Modal>
  );
}
