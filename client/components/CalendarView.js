"use client";

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TaskModal from './TaskModal';

const localizer = momentLocalizer(moment);

export default function CalendarView({ tasks, onTaskCreate, onTaskClick }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const events = tasks
    .filter(task => task.dueDate)
    .map(task => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
    }));

  const handleSelectEvent = (event) => {
    const clickedTask = tasks.find(t => t._id === event.id);
    if (clickedTask) {
      onTaskClick(clickedTask); 
    }
  };


  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start); 
    setModalIsOpen(true); 
  };

  const handleCreateTaskInModal = (title, dueDate) => {
 
    onTaskCreate(title, dueDate);
  };

  return (
    <div className="bg-[#1D2125]" style={{ height: '75vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        selectable={true}
        onSelectSlot={handleSelectSlot} 
        onSelectEvent={handleSelectEvent}//
      />
      <TaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onTaskCreate={handleCreateTaskInModal}
        initialDate={selectedDate}
      />
    </div>
  );
}