import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Checkbox = ({ isDone, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors
      ${isDone ? 'bg-cyan-500 border-cyan-500' : 'bg-transparent border-gray-500 hover:border-gray-300'}`}
  >
    {isDone && (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </button>
);

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group flex items-start gap-3 p-3 bg-[#243555] rounded-lg shadow-lg cursor-grab active:cursor-grabbing text-gray-100 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
    >
      <Checkbox isDone={isDone} onToggle={handleToggleDone} />
      <p className={`flex-grow pr-6 ${isDone ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </p>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task._id);
        }}
        className="absolute top-2 right-2 p-1 text-gray-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-[#3B546B] hover:text-white transition-opacity"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
