import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

const isImageUrl = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase());
};

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const coverImage = task.attachments?.find(file => isImageUrl(file.url));
  const attachmentCount = task.attachments?.length || 0;
  const commentCount = task.comments?.length || 0;
  

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-[#243555] rounded-xl shadow-lg cursor-grab active:cursor-grabbing text-gray-100 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
    >
      {coverImage && (
        <div className="w-full h-50 overflow-hidden rounded-t-xl">
          <img src={coverImage.url} alt="Task cover" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="mb-2 text-base font-medium">{task.title}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {attachmentCount > 0 && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {attachmentCount}
            </span>
          )}
          {commentCount > 0 && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
              {commentCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
