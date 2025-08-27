"use client";

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TaskModal from './TaskModal';

const localizer = momentLocalizer(moment);

export default function CalendarView({ tasks, onTaskCreate }) {
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

  // This function is called when a user clicks on a date slot
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start); // Save the date that was clicked
    setModalIsOpen(true); // Open the modal
  };

  const handleCreateTaskInModal = (title, dueDate) => {
    // Pass the new task details up to the main dashboard page
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
        onSelectSlot={handleSelectSlot} // <-- SPECIFY THE HANDLER
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