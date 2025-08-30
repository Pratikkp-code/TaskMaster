"use client";

import { useState } from 'react';
import Modal from 'react-modal';
import taskService from '../services/task.service';
import moment from 'moment';
import MapComponent from './MapComponent';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1B263B',
    border: '1px solid #3B546B',
    borderRadius: '12px',
    color: 'white',
    width: '90%',
    maxWidth: '600px',
    padding: '0',
    zIndex: '1001',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },
  overlay: {
    backgroundColor: 'rgba(13, 27, 42, 0.9)',
    zIndex: '1000'
  },
};

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const Section = ({ title, children, icon }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="flex-shrink-0 w-6 text-gray-400">{icon}</div>
    <div className="flex-grow">
      <h3 className="font-semibold mb-3 text-gray-400">{title}</h3>
      {children}
    </div>
  </div>
);

export default function TaskDetailModal({ task, isOpen, onRequestClose, onUpdate }) {
  const [newComment, setNewComment] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [locationAddress, setLocationAddress] = useState(task?.location?.address || '');

  if (!task) return null;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || isCommenting) return;
    setIsCommenting(true);
    try {
      const userName = "Test User";
      await taskService.addComment(task._id, newComment, userName);
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleSetLocation = async () => {
    if (!locationAddress) return;
    try {
      await taskService.setLocation(task._id, locationAddress);
    } catch (error) {
      console.error("Failed to set location:", error);
      alert("Failed to set location. The address may be invalid.");
    }
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!fileToUpload || isUploading) return;
    setIsUploading(true);
    try {
      await taskService.attachFile(task._id, fileToUpload);
      setFileToUpload(null);
    } catch (error) {
      console.error("File upload failed:", error);
      alert("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const LocationIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
  const AttachmentIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
  const ActivityIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" /></svg>;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <header className="flex-shrink-0 p-6 border-b border-[#3B546B]">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white">{task.title}</h2>
          <button onClick={onRequestClose} className="text-3xl text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
      </header>

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">

        <Section title="Location" icon={LocationIcon}>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="Enter an address"
              className="flex-grow p-2 rounded-lg bg-[#243555] border border-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            />
            <button onClick={handleSetLocation} className="px-4 py-1 bg-cyan-600 rounded-lg text-sm font-semibold text-white hover:bg-cyan-700 transition-colors transform active:scale-95">Set</button>
          </div>
          {task.location?.lat && task.location?.lng && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <MapComponent location={task.location} />
            </div>
          )}
        </Section>
        
        <Section title="Attachments" icon={AttachmentIcon}>
          <div className="space-y-2">
            {task.attachments?.map((file, index) => (
              <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="block text-cyan-400 hover:underline">
                {file.fileName}
              </a>
            ))}
          </div>
          <div className="mt-3 flex gap-2 items-center">
            <input type="file" onChange={handleFileChange} className="text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3B546B] file:text-gray-200 hover:file:bg-gray-600 transition-colors" />
            <button onClick={handleFileUpload} disabled={!fileToUpload || isUploading} className="px-3 py-1 bg-cyan-600 rounded-lg text-sm disabled:bg-gray-500 disabled:cursor-not-allowed text-white hover:bg-cyan-700 transition-colors transform active:scale-95">
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </Section>
        
        <Section title="Activity" icon={ActivityIcon}>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 rounded-lg bg-[#243555] border border-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
              rows="2"
            ></textarea>
            <button type="submit" disabled={isCommenting} className="mt-2 px-4 py-2 bg-cyan-600 rounded-lg text-sm font-semibold disabled:bg-gray-500 text-white hover:bg-cyan-700 transition-colors transform active:scale-95">
              {isCommenting ? 'Saving...' : 'Save'}
            </button>
          </form>
          <div className="space-y-4">
            {task.comments?.map(comment => (
              <div key={comment._id || comment.createdAt} className="text-sm">
                <p><strong>{comment.userName}</strong> <span className="text-gray-400">{moment(comment.createdAt).fromNow()}</span></p>
                <div className="p-2 bg-[#243555] rounded-lg mt-1 text-gray-200">{comment.text}</div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </Modal>
  );
}