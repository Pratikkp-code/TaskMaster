"use client";
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay ,useDroppable } from '@dnd-kit/core';
import { SortableContext , arrayMove } from '@dnd-kit/sortable';
import { useDebounce } from 'use-debounce';
import authService from '../../services/auth.service';
import taskService from '../../services/task.service';
import TaskCard from '../../components/TaskCard';
import CalendarView from '../../components/CalendarView';
import TaskDetailModal from '../../components/TaskDetailModal';
import AddTaskCard from '../../components/AddTaskCard';


const Column = ({ id, title, tasks, onTaskCreated, onClick, color, onDelete }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-[320px] bg-[#1B263B] p-4 rounded-2xl shadow-xl h-full flex flex-col"
    >
      <h2 className={`text-sm font-bold mb-4 px-1 ${color}`}>{title.toUpperCase()}</h2>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        <SortableContext id={id} items={tasks.map(t => t._id)}>
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={onClick}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      {title === 'To Do' && <AddTaskCard onTaskCreated={onTaskCreated} />}
    </div>
  );
};

export default function DashboardPage() {
const [tasks, setTasks] = useState([]);
const [activeTask, setActiveTask] = useState(null);
const [view, setView] = useState('board');
const [selectedTask, setSelectedTask] = useState(null);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
const router = useRouter();
useEffect(() => {
taskService.searchTasks(debouncedSearchTerm)
.then(response => setTasks(response.data))
.catch(err => {
if (err.response?.status === 401) { authService.logout(); router.push('/login'); }
});
}, [debouncedSearchTerm, router]);
useEffect(() => {
const socket = new WebSocket('wss://realtime-service-4dx3.onrender.com');
socket.onmessage = (event) => {
const message = JSON.parse(event.data);
if (message.event === 'TASK_UPDATED') {
const updatedTask = message.task;
setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
setSelectedTask(prev => prev?._id === updatedTask._id ? updatedTask : prev);
} else if (message.event === 'TASK_CREATED') {
setTasks(prev => [message.task, ...prev]);
} else if (message.event === 'TASK_DELETED') {
setTasks(prev => prev.filter(t => t._id !== message.taskId));
}
};
return () => socket.close();
}, []);

const columns = useMemo(() => ({
'To Do': tasks.filter(t => t.status === 'To Do'),
'Done': tasks.filter(t => t.status === 'Done'),
}), [tasks]);
const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
const handleCreateTask = async (title, dueDate) => {
  if (!title) return;
  const finalDueDate = dueDate || new Date(new Date().setDate(new Date().getDate() + 3)).toISOString();

  try {
    await taskService.createTask(title, '', 'To Do', finalDueDate);
    const newTask = response.data;
    setTasks(prevTasks => [newTask, ...prevTasks]);
  } catch (error) {
    console.error('Failed to create task:', error);
    alert('Failed to create the task.');
  }
};
const handleOpenTaskDetails = (task) => { setSelectedTask(task); setIsDetailModalOpen(true); };
const handleStatusChange = (taskToUpdate, newStatus) => {
taskService.updateTask(taskToUpdate._id, { status: newStatus })
.catch(() => alert("Failed to update task status."));
};
const handleDeleteTask = (taskId) => {
taskService.deleteTask(taskId).catch(() => alert("Failed to delete task."));
};
const findColumn = taskId => Object.keys(columns).find(key => columns[key].some(t => t._id === taskId));
const handleDragStart = (event) => { setActiveTask(tasks.find(t => t._id === event.active.id) || null); };
const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !activeTask) {
      setActiveTask(null);
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const activeColumnId = findColumn(activeId);
    const overColumnId = findColumn(overId);
    if (activeColumnId === overColumnId) {
      setTasks(prevTasks => {
        const sortedTasks = prevTasks.filter(t => t.status === activeColumnId);
        const oldIndex = sortedTasks.findIndex(t => t._id === activeId);
        const newIndex = sortedTasks.findIndex(t => t._id === overId);
        const newSortedTasks = arrayMove(sortedTasks, oldIndex, newIndex);
        return prevTasks.map(t => {
          const updatedTask = newSortedTasks.find(nt => nt._id === t._id);
          return updatedTask || t;
        });
      });
    }
    else if (activeColumnId !== overColumnId) {
      handleStatusChange(activeTask, overColumnId);
    }
    setActiveTask(null);
  };
return (
    <main className="min-h-screen relative overflow-hidden bg-[#0D1B2A] text-gray-200 font-sans p-6">
      <style>
        {`
        /* Keyframes for a gentle spin animation */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        /* Keyframes for a high-tech particle animation */
        @keyframes tech-float {
          0% {
            transform: translateY(0) scale(1) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-50vh) scale(1.1) translateX(20px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(1) translateX(0);
            opacity: 0.2;
          }
        }
        
        .particle {
          position: absolute;
          bottom: -20px;
          animation: tech-float linear infinite;
          border-radius: 50%; /* Makes the SVG path a circle */
        }
        
        /* Custom scrollbar styling for better aesthetics */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1B263B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3B546B;
          border-radius: 10px;
        }
        `}
      </style>
      
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <svg 
            key={i} 
            className="particle" 
            style={{ 
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              fill: `hsl(${Math.random() * 60 + 180}, 80%, 60%)` 
            }}
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-4xl font-extrabold text-white tracking-wider flex items-center gap-4 font-family: Arial, sans-serif;">
            TaskMaster
          </h1>
          
          <div className="flex-grow max-w-xl relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1B263B] text-gray-100 placeholder-gray-400 border-2 border-transparent focus:outline-none focus:border-cyan-500 transition-colors duration-200"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('board')} 
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform active:scale-95 ${view === 'board' ? 'bg-cyan-600 text-white shadow-md' : 'bg-[#1B263B] text-gray-300 hover:bg-[#243555]'}`}>
                Board
            </button>
            <button 
              onClick={() => setView('calendar')} 
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 transform active:scale-95 ${view === 'calendar' ? 'bg-cyan-600 text-white shadow-md' : 'bg-[#1B263B] text-gray-300 hover:bg-[#243555]'}`}>
                Calendar
            </button>
            <button 
              onClick={() => authService.logout()} 
              className={`px-5 py-2 bg-red-600 text-sm font-semibold rounded-lg text-white shadow-md hover:bg-red-700 transition-all duration-200 flex items-center gap-2 transform active:scale-95`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12h-9" />
              </svg>
              Logout
            </button>
          </div>
        </header>
        <div className="flex-grow overflow-x-auto pb-4">
            {view === 'board' ? (
                <div className="inline-flex gap-6 h-full">
              <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

              <Column id="To Do" title="To Do" tasks={columns['To Do']} onTaskCreated={handleCreateTask} onClick={handleOpenTaskDetails} onDelete={handleDeleteTask} color="text-accent-yellow" />

              <Column id="Done" title="Done" tasks={columns['Done']} onClick={handleOpenTaskDetails} onDelete={handleDeleteTask} color="text-accent-green" />

              <DragOverlay>

              {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}

            </DragOverlay>

            </DndContext>

              </div>        
            ) : (
                <CalendarView tasks={tasks} onTaskClick={handleOpenTaskDetails} onTaskCreate={handleCreateTask} />
            )}
        
        <TaskDetailModal task={selectedTask} isOpen={isDetailModalOpen} onRequestClose={() => setIsDetailModalOpen(false)} />
      </div>
     </div>
    </main>
  );
}
