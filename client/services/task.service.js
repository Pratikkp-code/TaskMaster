import axios from 'axios';
import { get } from 'mongoose';


const API_HOST = process.env.NEXT_PUBLIC_AUTH_API_URL;
const API_URL = `${API_HOST}/api/auth/`;



const getAuthHeader = () => {
  const token = JSON.parse(localStorage.getItem('user_token'));
  if (token) {
    return { 'x-auth-token': token };
  } else {
    return {};
  }
};

// --- API Functions ---


const getTasks = () => {
  return axios.get(API_URL,{ headers: getAuthHeader() });
};

const createTask = (title, description, status, dueDate) => {
  return axios.post(API_URL, { title, description, status, dueDate }, { headers: getAuthHeader() });
};

const updateTask = (taskId, taskData) => {
  return axios.put(API_URL + taskId, taskData, { headers: getAuthHeader() });
};

const deleteTask = (taskId) => {
  return axios.delete(API_URL+ taskId, { headers: getAuthHeader()});
}

const searchTasks = (searchTerm) => {
  return axios.get(`${API_URL}search?q=${searchTerm}`, { headers: getAuthHeader() });
};


const addComment = (taskId, text, userName) => {
  return axios.post(`${API_URL}${taskId}/comments`, { text, userName }, { headers: getAuthHeader() });
};

const attachFile = (taskId, file) => {
  const formData = new FormData();
  formData.append('attachment', file);

  return axios.post(`${API_URL}${taskId}/attach`,formData, {
    headers : {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    },
  });
};

const setLocation = (taskId, address) => {
  return axios.post(`${API_URL}${taskId}/location`, { address }, { headers: getAuthHeader() });
};


const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  addComment,
  attachFile,
  setLocation,
};

export default taskService;
