import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Utility function for making API calls
const apiCall = async (method, url, data = null) => {
  try {
    const response = await axios({ method, url, data });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Login function
export const login = async (username, password) => {
  return apiCall('post', `${API_URL}/login`, { username, password });
};

// Register function
export const register = async (username, email, password) => {
  return apiCall('post', `${API_URL}/register`, { username, email, password });
};

// Profile functions
export const profile = async () => {
  return apiCall('get', `${API_URL}/profile`);
};

export const updateProfile = async (username, email, password) => {
  return apiCall('put', `${API_URL}/profile`, { username, email, password });
};

// Subject functions
export const getSubjects = async () => {
  return apiCall('get', `${API_URL}/dashboard/`);
};

export const createSubject = async (subject) => {
  return apiCall('post', `${API_URL}/dashboard/subjects`, subject);
};

export const getTopics = async () => {
  return apiCall('get', `${API_URL}/dashboard/topics`);
}
export const createTopic = async (topic) => {
  return apiCall('post', `${API_URL}/dashboard/topics`, topic);
}