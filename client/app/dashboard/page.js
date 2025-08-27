"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';
import taskService from '../../services/task.service';

// --- DND-Kit Imports ---
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

// --- Component Imports ---
import TaskCard from '../../components/TaskCard';
import CalendarView from '../../components/CalendarView';

// --- Column Component (with onDelete passed down) ---
const Column = ({ id, title, tasks, onStatusChange, onDelete, color}) => (
  <div className="flex-shrink-0 w-[300px] bg-[#101204] p-2 rounded-xl h-full">
    <h2 className={`text-sm font-semibold mb-3 px-2 ${color}`}>{title.toUpperCase()}</h2>
    <SortableContext id={id} items={tasks.map(t => t._id)}>
      <div className="space-y-3 min-h-[100px]">
        {tasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onStatusChange={onStatusChange}
            onDelete={onDelete} // It's passed to the TaskCard here
          />
        ))}
      </div>
    </SortableContext>
  </div>
);
export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [view, setView] = useState('board');
  const router = useRouter();

  // --- Main useEffect for Auth Check and Initial Data Fetch ---
  useEffect(() => {
    taskService.getTasks()
      .then(response => setTasks(response.data))
      .catch(err => {
        if (err.response?.status === 401) { authService.logout(); router.push('/login'); }
      });
  }, [router]);

  // --- WebSocket useEffect for Real-Time Updates ---
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4003');
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Real-time event:', message);

      if (message.event === 'TASK_CREATED') {
        setTasks(prev => [message.task, ...prev]);
      } else if (message.event === 'TASK_UPDATED') {
        setTasks(prev => prev.map(t => t._id === message.task._id ? message.task : t));
      } else if (message.event === 'TASK_DELETED') {
        setTasks(prev => prev.filter(t => t._id !== message.taskId));
      }
    };
    return () => socket.close();
  }, []);

  // --- Memoized Columns (Includes "In Progress") ---
  const columns = useMemo(() => ({
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'Done': tasks.filter(t => t.status === 'Done'),
  }), [tasks]);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  }));

  // --- CRUD Handlers ---
  const handleCreateTask = async (title, dueDate) => {
    if (!title) return;
    try {
      // The API call is made, and the real-time event from WebSocket will update the UI
      await taskService.createTask(title, '', 'To Do', dueDate);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };
  
  const handleStatusChange = (task, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(t => 
        t._id === task._id ? { ...t, status: newStatus } : t
      )
    );
  };

   const handleDeleteTask = (taskId) => {
    taskService.deleteTask(taskId)
      .then(() => {
        // Optimistic update on success
        setTasks(prev => prev.filter(t => t._id !== taskId));
      })
      .catch(() => alert("Failed to delete task."));
  };


  // --- Drag & Drop Handlers ---
  const findColumn = taskId => Object.keys(columns).find(key => columns[key].some(t => t._id === taskId));

  const handleDragStart = (event) => {
    setActiveTask(tasks.find(t => t._id === event.active.id) || null);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !activeTask) {
      setActiveTask(null);
      return;
    }

    const overId = over.id;
    // Check if we are dropping over a column or another task
    const overIsAColumn = over.data.current?.type === 'Column' || columns[overId];
    let destinationColumn = '';
    if (overIsAColumn) {
      destinationColumn = overId;
    } else {
      destinationColumn = findColumn(overId);
    }
    
    if (destinationColumn && activeTask.status !== destinationColumn) {
      handleStatusChange(activeTask, destinationColumn);
    }
    setActiveTask(null);
  };
  
  return (
    <main className="min-h-screen p-4 sm:p-6 bg-[#1D2125] text-white overflow-x-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Board</h1>
        <button onClick={() => { authService.logout(); router.push('/login'); }} className="px-4 py-2 bg-red-600 text-sm font-semibold rounded-md hover:bg-red-700">
          Logout
        </button>
      </header>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setView('board')} 
          className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'board' ? 'bg-blue-600' : 'bg-[#282E33]'}`}
        >
          Board
        </button>
        <button 
          onClick={() => setView('calendar')} 
          className={`px-4 py-2 text-sm font-semibold rounded-md ${view === 'calendar' ? 'bg-blue-600' : 'bg-[#282E33]'}`}
        >
          Calendar
        </button>
      </div>

      {view === 'board' ? (
        <>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateTask(e.target.title.value); e.target.reset(); }} className="mb-8 flex gap-2 max-w-sm">
            <input 
              name="title" 
              placeholder="Add a new card..." 
              className="flex-grow p-2 rounded-md bg-[#282E33] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-sm font-semibold rounded-md hover:bg-blue-700">
              Add
            </button>
          </form>

          <div className="flex gap-4 w-full h-full">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              {Object.entries(columns).map(([columnId, columnTasks]) => (
                <Column 
                  id={columnId}
                  key={columnId}
                  title={columnId} 
                  tasks={columnTasks} 
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask} // Pass the delete handler
                  color={
                    columnId === 'To Do' ? 'text-yellow-400' : 
                    columnId === 'In Progress' ? 'text-purple-400' : 'text-green-400'
                  } 
                />
              ))}
              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} onStatusChange={() => {}} onDelete={() => {}} /> : null}
              </DragOverlay>
            </DndContext>
          </div>
        </>
      ) : (
        <CalendarView tasks={tasks} onTaskCreate={handleCreateTask} />
      )}
    </main>
  );
}