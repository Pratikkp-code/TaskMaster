import axios from 'axios';

// The task-service is running on port 4002
const API_URL = 'http://localhost:4002/api/tasks/';

// Helper function to get the auth token from local storage
const getAuthHeader = () => {
  const token = JSON.parse(localStorage.getItem('user_token'));
  if (token) {
    return { 'x-auth-token': token };
  } else {
    return {};
  }
};

// --- API Functions ---

// GET /api/tasks - Fetch all tasks for the logged-in user
const getTasks = () => {
  return axios.get(API_URL,{ headers: getAuthHeader() });
};

// POST /api/tasks - Create a new task
const createTask = (title, description, status, dueDate) => {
  return axios.post(API_URL, { title, description, status, dueDate }, { headers: getAuthHeader() });
};

const updateTask = (taskId, taskData) => {
  return axios.put(API_URL + taskId, taskData, { headers: getAuthHeader() });
};

const deleteTask = (taskId) => {
  return axios.delete(API_URL+ taskId, { headers: getAuthHeader()});
}

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};

export default taskService;