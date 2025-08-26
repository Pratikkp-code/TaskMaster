import express from 'express';
import { getTasks, createTask ,updateTask, deleteTask} from '../controllers/task.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply the authMiddleware to both routes.
// This means a user MUST be logged in to get or create tasks.
router.route('/')
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);
  // Add a new route for updating a task
router.route('/:id')
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);


export default router;