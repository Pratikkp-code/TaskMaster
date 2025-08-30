"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AddTaskCard({ onTaskCreated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setIsEditing(false); 
      return;
    }
    onTaskCreated(title);
    setTitle('');
    setIsEditing(false);
  };

  // If  NOT in editing mode, show the "Add a card" button
  if (!isEditing) {
    return (
      <motion.button
        layout
        onClick={() => setIsEditing(true)}
        className="w-full text-left p-2 mt-2 text-text-secondary hover:bg-background-medium rounded-md transition-colors"
      >
        + Add a card
      </motion.button>
    );
  }

  // If  in editing mode, show the form
  return (
    <motion.form layout onSubmit={handleSubmit} className="mt-2">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit} 
        placeholder="Enter a title for this card..."
        className="w-full p-3 rounded-lg bg-background-medium text-text-primary resize-none shadow-md focus:outline-none focus:ring-2 focus:ring-accent-blue"
        rows="3"
      />
      <div className="flex items-center gap-2 mt-2">
        <button 
          type="submit" 
          className="px-4 py-2 bg-accent-blue text-sm font-semibold text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add card
        </button>
        <button 
          type="button" 
          onClick={() => setIsEditing(false)} 
          className="text-2xl text-text-secondary hover:text-text-primary"
          aria-label="Cancel"
        >
          &times;
        </button>
      </div>
    </motion.form>
  );
}