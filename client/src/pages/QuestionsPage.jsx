import React, { useState, useEffect } from "react";
import { getAllQuestions } from "../api";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const QuestionsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const QuestionItem = styled.li`
  background: #fff;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const QuestionHeader = styled.div`
  font-weight: bold;
  color: #555;
`;

const QuestionContent = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #777;
`;

const Loading = styled.div`
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
  color: #888;
`;

const Error = styled.div`
  font-size: 16px;
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllQuestions();
      console.log(data); // Log the data to inspect the structure
      setQuestions(data);
    } catch (error) {
      setError("Failed to fetch questions. Please try again later.");
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      window.location.href = "/signin";
    }
    fetch("http://localhost:8000/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
        window.location.href = "/signin";
      });
  };

  useEffect(() => {
    fetchQuestions();
    checkLogin();
  }, []);

  return (
    <PageContainer>
      <AdminSidebar subjects={questions} />
      <ContentContainer>
        <Title>Questions List</Title>
        {loading && <Loading>Loading questions...</Loading>}
        {error && <Error>{error}</Error>}
        {!loading && !error && (
          <QuestionsList>
            {questions.map((question, index) => (
                <a href={`/editor?question_id=${question.question_id}`} style={{textDecoration: 'none'}}>
              <QuestionItem key={index}>
                <QuestionHeader>Question {index + 1}:</QuestionHeader>
                <QuestionContent>{question.question_text}</QuestionContent>
              </QuestionItem>
                </a>
            ))}
          </QuestionsList>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default QuestionPage;
