import axios from 'axios';

const API_URL = `https://auth-service-kidv.onrender.com/api/auth/`;

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
