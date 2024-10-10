import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Login function
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

// Register function
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

// Profile functions
export const profile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
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

// Subject functions
export const getSubjects = async () => {
  const response = await fetch(`${API_URL}/subjects/`);
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return await response.json();
};

export const createSubject = async (subject) => {
  const response = await fetch(`${API_URL}/subjects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  });
  if (!response.ok) {
    throw new Error("Failed to create subject");
  }
  return await response.json();
};

export const updateSubject = async (subjectId, subject) => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  });
  if (!response.ok) {
    throw new Error("Failed to update subject");
  }
  return await response.json();
};

export const deleteSubject = async (subjectId) => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete subject");
  }
  return await response.json();
};

// Topic functions
export const getTopics = async () => {
  const response = await fetch(`${API_URL}/topics/`);
  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }
  return await response.json();
};

export const createTopic = async (topic) => {
  const response = await fetch(`${API_URL}/topics/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(topic),
  });
  if (!response.ok) {
    throw new Error("Failed to create topic");
  }
  return await response.json();
};

export const updateTopic = async (topicId, topic) => {
  const response = await fetch(`${API_URL}/topics/${topicId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(topic),
  });
  if (!response.ok) {
    throw new Error("Failed to update topic");
  }
  return await response.json();
};

export const deleteTopic = async (topicId) => {
  const response = await fetch(`${API_URL}/topics/${topicId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete topic");
  }
  return await response.json();
};

// Question functions
export const getQuestions = async () => {
  const response = await fetch(`${API_URL}/questions/`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return await response.json();
};

export const createQuestion = async (question) => {
  const response = await fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
  if (!response.ok) {
    throw new Error("Failed to create question");
  }
  return await response.json();
};

export const updateQuestion = async (questionId, question) => {
  const response = await fetch(`${API_URL}/questions/${questionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  return await response.json();
};

export const deleteQuestion = async (questionId) => {
  const response = await fetch(`${API_URL}/questions/${questionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
  return await response.json();
};

// Answer functions
export const getAnswers = async () => {
  const response = await fetch(`${API_URL}/answers/`);
  if (!response.ok) {
    throw new Error("Failed to fetch answers");
  }
  return await response.json();
};

export const createAnswer = async (answer) => {
  const response = await fetch(`${API_URL}/answers/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  });
  if (!response.ok) {
    throw new Error("Failed to create answer");
  }
  return await response.json();
};

export const updateAnswer = async (answerId, answer) => {
  const response = await fetch(`${API_URL}/answers/${answerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  });
  if (!response.ok) {
    throw new Error("Failed to update answer");
  }
  return await response.json();
};

export const deleteAnswer = async (answerId) => {
  const response = await fetch(`${API_URL}/answers/${answerId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete answer");
  }
  return await response.json();
};

// Test Case functions
export const getTestCases = async () => {
  const response = await fetch(`${API_URL}/testcases/`);
  if (!response.ok) {
    throw new Error("Failed to fetch test cases");
  }
  return await response.json();
};

export const createTestCase = async (testCase) => {
  const response = await fetch(`${API_URL}/testcases/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testCase),
  });
  if (!response.ok) {
    throw new Error("Failed to create test case");
  }
  return await response.json();
};

export const updateTestCase = async (testCaseId, testCase) => {
  const response = await fetch(`${API_URL}/testcases/${testCaseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testCase),
  });
  if (!response.ok) {
    throw new Error("Failed to update test case");
  }
  return await response.json();
};

export const deleteTestCase = async (testCaseId) => {
  const response = await fetch(`${API_URL}/testcases/${testCaseId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete test case");
  }
  return await response.json();
};
