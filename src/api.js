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
// export const getSubjects = async () => {
//   try {
//     const response = await fetch(`${API_URL}/subjects/`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch subjects: ${response.status} ${response.statusText}`
//       );
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     throw error;
//   }
// };

// export const createSubject = async (subject) => {
//   console.log("Sending payload:", subject); // Log the payload
//   const response = await fetch(`${API_URL}/subjects/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(subject),
//   });
//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Error response:", errorText); // Log the error response
//     throw new Error("Failed to create subject");
//   }
//   return await response.json();
// };

// Subject functions

export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Create a new subject
export const createSubject = async (subject) => {
  try {
    const response = await axios.post(`${API_URL}/dashboard/subjects`, subject);
    return response.data;
  } catch (error) {
    console.error("Error creating subject:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Fetch a specific topic by subject ID
export const getTopics = async (subjectId) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/subjects/${subjectId}/topics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Create a new topic under a specific subject
export const createTopic = async (subjectId, topic) => {
  try {
    const response = await axios.post(`${API_URL}/dashboard/subjects/${subjectId}/topics`, topic);
    return response.data;
  } catch (error) {
    console.error("Error creating topic:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Fetch a specific question by topic ID
export const getQuestions = async (topicId) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/topics/${topicId}/questions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Create a new question under a specific topic
export const createQuestion = async (topicId, question) => {
  try {
    const response = await axios.post(`${API_URL}/dashboard/topics/${topicId}/questions`, question);
    return response.data;
  } catch (error) {
    console.error("Error creating question:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Fetch answers for a specific question by question ID
export const getAnswers = async (questionId) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/questions/${questionId}/answers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching answers:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Create a new answer under a specific question
export const createAnswer = async (questionId, answer) => {
  try {
    const response = await axios.post(`${API_URL}/dashboard/questions/${questionId}/answers`, answer);
    return response.data;
  } catch (error) {
    console.error("Error creating answer:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Fetch test cases for a specific question by question ID
export const getTestCases = async (questionId) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/questions/${questionId}/testcases`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test cases:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};

// Create a new test case under a specific question
export const createTestCase = async (questionId, testCase) => {
  try {
    const response = await axios.post(`${API_URL}/dashboard/questions/${questionId}/testcases`, testCase);
    return response.data;
  } catch (error) {
    console.error("Error creating test case:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
};