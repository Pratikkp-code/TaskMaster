"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Reusable Checkbox Component ---
const Checkbox = ({ isDone, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors
      ${isDone ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-400 hover:border-white'}`}
  >
    {isDone && (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </button>
);

// --- 1. THE PROPS NOW INCLUDE `onDelete` ---
export default function TaskCard({ task, onStatusChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDone = task.status === 'Done';

  const handleToggleDone = () => {
    const newStatus = isDone ? 'To Do' : 'Done';
    onStatusChange(task, newStatus);
  };

  return (
    // We add `group` here so the button can appear on hover
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group flex items-start gap-3 p-3 bg-[#282E33] rounded-lg shadow-md cursor-grab active:cursor-grabbing text-white"
    >
      <Checkbox isDone={isDone} onToggle={handleToggleDone} />
      <p className={`flex-grow pr-6 ${isDone ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </p>
      
      {/* --- 2. THIS IS THE NEW DELETE BUTTON --- */}
      {/* It is only visible when you hover over the card (`group-hover:opacity-100`) */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevents the drag event from firing
          onDelete(task._id);
        }}
        className="absolute top-2 right-2 p-1 text-gray-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-600 hover:text-white transition-opacity"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
