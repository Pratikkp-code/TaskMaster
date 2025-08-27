"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// --- Custom Styling for the Modal ---
// --- THE NEW STYLE WITH MORE OPACITY ---
// --- THE NEW, CORRECTED STYLE ---
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1D2125',
    border: '1px solid #4A5568',
    borderRadius: '12px',
    color: 'white',
    width: '90%',
    maxWidth: '500px',
    padding: '24px',
    // Give the content a z-index as well, higher than the overlay's
    zIndex: '1001'
  },
  overlay: {
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    // THIS IS THE CRITICAL FIX
    // A high z-index ensures the overlay is on top of all other page content.
    zIndex: '1000'
  },
};

// Bind the modal to your app element for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function TaskModal({ isOpen, onRequestClose, onTaskCreate, initialDate }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    // When the modal opens, pre-fill the date with the date the user clicked on
    if (initialDate) {
      setDueDate(new Date(initialDate));
    }
  }, [initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please provide a title and a due date.');
      return;
    }
    // Call the creation function passed from the parent component
    onTaskCreate(title, dueDate.toISOString());
    onRequestClose(); // Close the modal
    setTitle(''); // Reset the form
    setDueDate(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add New Task"
    >
      <h2 className="text-2xl font-bold mb-4">Add a Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a name for this card"
            className="w-full p-2 rounded-md bg-[#282E33] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            className="w-full p-2 rounded-md bg-[#282E33] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 bg-[#282E33] rounded-md hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
            Add Card
          </button>
        </div>
      </form>
    </Modal>
  );
}