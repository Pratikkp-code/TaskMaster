import express from 'express';
import { getTasks, createTask ,updateTask, deleteTask, searchTasks, addComment, setTaskLocation, chatWithAI} from '../controllers/task.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import uploadToGCS  from '../gcs.upload.js';
import { attachFile } from '../controllers/task.controller.js';


const router = express.Router();

// Apply the authMiddleware to both routes.
// This means a user MUST be logged in to get or create tasks.
router.route('/')
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);

router.get('/search', authMiddleware, searchTasks);

router.post('/chat', authMiddleware, chatWithAI);

router.route('/:id')
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);

router.post('/:id/comments', authMiddleware, addComment);

router.post('/:id/attach', authMiddleware, uploadToGCS, attachFile);

router.post('/:id/location', authMiddleware, setTaskLocation);

export default router;