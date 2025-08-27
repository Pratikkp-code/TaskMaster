import axios from 'axios';

// The auth-service is running on port 4001
const API_URL = 'http://localhost:4001/api/auth/';

const register = (name, email, password) => {
  return axios.post(API_URL + 'register', {
    name,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  }).then((response) => {
    if (response.data.token) {
      // Store the user's token in local storage for persistence
      localStorage.setItem('user_token', JSON.stringify(response.data.token));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user_token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;