import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Utility function for making API calls
const apiCall = async (method, url, data = null) => {
  try {
    console.log(`Making ${method.toUpperCase()} request to ${url} with data:`, data);
    const response = await axios({ method, url, data });
    console.log(`Response from ${url}:`, response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Error during API call:", error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      throw new Error("No response received from server");
    } else {
      // Something else happened while setting up the request
      console.error("Error setting up request:", error.message);
      throw new Error("Error setting up request: " + error.message);
    }
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