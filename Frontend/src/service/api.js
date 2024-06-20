import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Register user
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, {
      username,
      email,
      password,
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Start quiz
export const startQuiz = async (payload) => {
  try {
    const response = await axios({
        url: `${API_URL}/quizzes/start`,
        method: "post",
        data: payload
      })
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Submit quiz
export const submitQuiz = async (quizId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes/submit`, { quizId, answers });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
