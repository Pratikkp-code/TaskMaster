import axios from 'axios';
import Task from "../models/task.model.js";    
import { redisClient } from "../config/redis.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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

    const message = JSON.stringify({ event: 'TASK_CREATED', task });
    await redisClient.publish('task-updates', message);

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const updateTask = async (req, res) => {
  const { title, description, status, dueDate ,location} = req.body;
  
  try {
    const task = await Task.findById(req.params.id);
    task.dueDate = dueDate || task.dueDate;
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    

    if (location) {
      if (location.address) task.location.address = location.address;

      if (location.lat) task.location.lat = location.lat;
      if (location.lng) task.location.lng = location.lng;
    }

    await task.save();


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

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }


    await Task.findByIdAndDelete(req.params.id);

    const message = JSON.stringify({ event: 'TASK_DELETED', taskId: req.params.id });
    await redisClient.publish('task-updates', message);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const searchTasks = async (req, res) => {
  try {
    const searchTerm = req.query.q;


    if (!searchTerm || searchTerm.trim() === '') {
      const allTasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
      return res.json(allTasks);
    }


    const tasks = await Task
      .find(
  
        { user: req.user.id, $text: { $search: searchTerm } },

        { score: { $meta: 'textScore' } }
      )

      .sort({ score: { $meta: 'textScore' } });
    
    res.json(tasks);
  } catch (err)
 {
    console.error(`Search Error: ${err.message}`);

    if (err.message.includes('text index required')) {
        return res.status(500).json({ msg: 'Search functionality is not enabled on the database.' });
    }
    res.status(500).send('Server Error');
  }
};

export const addComment = async (req, res) => {

  console.log(`Adding comment to task ${req.params.id}`);
  console.log('Comment Body:', req.body);
  console.log('User from token:', req.user);

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const { text, userName } = req.body;


    if (!text || !userName) {
        return res.status(400).json({ msg: 'Text and userName are required.' });
    }

    const newComment = {
      user: req.user.id, // The ID of the user from the JWT
      userName: userName,   // The name of the user sent from the client
      text: text,           // The comment text
    };

    task.comments.unshift(newComment);
    await task.save();


    const message = JSON.stringify({ event: 'TASK_UPDATED', task: task });
    await redisClient.publish('task-updates', message);


    res.status(201).json(task); 
  } catch (err) {
    console.error(`SERVER CRASH in addComment: ${err.message}`);
    res.status(500).send('Server Error');
  }
};


export const attachFile = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }


    const newAttachment = {
      fileName: req.file.originalname,
      url: req.file.publicUrl,
    };

    task.attachments.push(newAttachment);
    await task.save();

    const message = JSON.stringify({ event: 'TASK_UPDATED', task });
    await redisClient.publish('task-updates', message);

    res.json(task);
  } catch (err) {
    console.error(`SERVER CRASH in attachFile: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

export const setTaskLocation = async (req, res) => {
  const { address } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });


    const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL
    
    const geoResponse = await axios.post(`https://${GEO_SERVICE_URL}.onrender.com/api/geocode`, { address });
    
    const { lat, lng } = geoResponse.data;

    task.location = { address, lat, lng };
    await task.save();

    // 4. Send real-time update
    const message = JSON.stringify({ event: 'TASK_UPDATED', task });
    await redisClient.publish('task-updates', message);

    res.json(task);
  } catch (err) {
    console.error('Set Location Error:', err.response ? err.response.data : err.message);
    res.status(500).send('Server Error');
  }
};
    
