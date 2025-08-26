import Task from "../models/task.model.js";    
import { redisClient } from "../config/redis.js";

export const getTasks = async (req, res) => {
  try {
    // Find tasks that belong to the user ID from the token
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  const { title, description, status, dueDate} = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      user: req.user.id,
    });

    const task = await newTask.save();
    
    // Publish an event to Redis for our real-time service (for later)
    const message = JSON.stringify({ event: 'TASK_CREATED', task });
    await redisClient.publish('task-updates', message);

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Add this new function to the file
export const updateTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  
  try {
    const task = await Task.findById(req.params.id);
    task.dueDate = dueDate || task.dueDate;
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    // Make sure the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();

    // Publish a TASK_UPDATED event to Redis
    const message = JSON.stringify({ event: 'TASK_UPDATED', task });
    await redisClient.publish('task-updates', message);

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    // Make sure the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Use deleteOne() or findByIdAndDelete()
    await Task.findByIdAndDelete(req.params.id);

    // Publish a TASK_DELETED event to Redis
    const message = JSON.stringify({ event: 'TASK_DELETED', taskId: req.params.id });
    await redisClient.publish('task-updates', message);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};