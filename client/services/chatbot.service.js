import axios from 'axios';

const API_URL = `https://task-service-ntn0.onrender.com/api/tasks`;

const getAuthHeader = () => {
const token = JSON.parse(localStorage.getItem('user_token'));
if (token) {
return { 'x-auth-token': token };
} else {
return {};
}
};
const sendMessage = (message) => {
return axios.post(`${API_URL}/chat`, { message }, { headers: getAuthHeader() });
};
const chatbotService = {
sendMessage,
};
export default chatbotService;
