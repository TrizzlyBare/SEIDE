import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies/auth
    headers: {
        'Content-Type': 'application/json',
    }
});

// Utility function for making API calls
const apiCall = async(method, url, data = null) => {
    try {
        console.log(`Making ${method.toUpperCase()} request to ${url} with data:`, data);
        const response = await axiosInstance({ method, url, data });
        console.log(`Response from ${url}:`, response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error during API call:", error.response.data);
            throw error.response.data; // This throws the response data so you can capture it in the calling function
        } else if (error.request) {
            console.error("No response received:", error.request);
            throw new Error("No response received from server");
        } else {
            console.error("Error setting up request:", error.message);
            throw new Error("Error setting up request: " + error.message);
        }
    }
};

// Authentication endpoints
export const createUserAuth = async(email, password) => {
    return apiCall("post", `${API_URL}/api/users`, { email, password });
};

export const generateToken = async(username, password) => {
    return apiCall("post", `${API_URL}/api/token`, { username, password });
};

export const getCurrentUser = async() => {
    return apiCall("get", `${API_URL}/api/users/me`);
};

// Lead management endpoints
export const createLead = async(leadData) => {
    return apiCall("post", `${API_URL}/api/leads`, leadData);
};

export const getLeads = async() => {
    return apiCall("get", `${API_URL}/api/leads`);
};

export const getLead = async(leadId) => {
    return apiCall("get", `${API_URL}/api/leads/${leadId}`);
};

export const updateLead = async(leadId, leadData) => {
    return apiCall("put", `${API_URL}/api/leads/${leadId}`, leadData);
};

export const deleteLead = async(leadId) => {
    return apiCall("delete", `${API_URL}/api/leads/${leadId}`);
};

// Subject endpoints
export const createSubject = async(subjectData) => {
    console.log("Attempting to create subject with data:", subjectData);
    return apiCall("post", "/subjects/", subjectData);
};


export const getSubjects = async() => {
    const subjects = await apiCall("get", "/subjects/");
    return subjects.map((subject, index) => ({
        ...subject,
        id: subject.id || index, // Use provided ID or fall back to index
    }));
};


// Topic endpoints
export const createTopic = async(subjectId, topicData) => {
    return apiCall("post", `${API_URL}/subjects/${subjectId}/topics/`, topicData);
};

export const getTopics = async(subjectId) => {
    return apiCall("get", `${API_URL}/subjects/${subjectId}/topics/`);
};

// Question endpoints
export const createQuestion = async(topicId, questionData) => {
    return apiCall("post", `${API_URL}/subjects/topics/${topicId}/questions/`, questionData);
};

export const getQuestions = async(topicId) => {
    return apiCall("get", `${API_URL}/subjects/topics/${topicId}/questions/`);
};

// Answer endpoints
export const createAnswer = async(questionId, answerData) => {
    return apiCall("post", `${API_URL}/questions/${questionId}/answers/`, answerData);
};

export const getAnswers = async(questionId) => {
    return apiCall("get", `${API_URL}/questions/${questionId}/answers/`);
};

// Test case endpoints
export const createTestCase = async(questionId, testCaseData) => {
    return apiCall("post", `${API_URL}/questions/${questionId}/testcases/`, testCaseData);
};

export const getTestCases = async(questionId) => {
    return apiCall("get", `${API_URL}/questions/${questionId}/testcases/`);
};

// Code execution endpoint
export const runCode = async(questionId, userCode) => {
    return apiCall("post", `${API_URL}/run_code/`, { question_id: questionId, user_code: userCode });
};

// Done questions endpoints
export const createDoneQuestion = async(questionId, doneQuestionData) => {
    return apiCall("post", `${API_URL}/questions/${questionId}/donequestions/`, doneQuestionData);
};

export const getDoneQuestions = async(questionId) => {
    return apiCall("get", `${API_URL}/questions/${questionId}/donequestions/`);
};

export const getUserDoneQuestions = async(userId) => {
    return apiCall("get", `${API_URL}/users/${userId}/donequestions/`);
};

export const getUserQuestionStatus = async(userId, questionId) => {
    return apiCall("get", `${API_URL}/users/${userId}/donequestions/${questionId}/is_correct`);
};

// User code endpoints
export const saveUserCode = async(userId, userCodeData) => {
    return apiCall("post", `${API_URL}/users/${userId}/user_code/`, userCodeData);
};

export const getUserCode = async(userId) => {
    return apiCall("get", `${API_URL}/users/${userId}/user_code/`);
};

export const getUserQuestionCode = async(userId, questionId) => {
    return apiCall("get", `${API_URL}/users/${userId}/user_code/${questionId}`);
};


export const loginUser = async(username, password) => {
    return apiCall("post", `${API_URL}/users/get`, { username, password });
};