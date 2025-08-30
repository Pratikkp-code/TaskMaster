import axios from 'axios';


const API_HOST = process.env.NEXT_PUBLIC_AUTH_API_URL ;
const API_URL = `${API_HOST}/api/auth/`;

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
