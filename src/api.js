import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const profile = async (username, email) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      username,
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProfile = async (username, email, password) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createSubject = async (subject) => {
  try {
    const response = await axios.post(`${API_URL}/create_subject`, subject);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};