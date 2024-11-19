import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const QuestionItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8f8f8;
  }
`;

const QuestionDashboard = () => {
  const [questions, setQuestions] = useState({
    labs: [],
    homework: [],
  });
  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const { subject_id, topic_id } = useParams();

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/subjects/${subject_id}`
        );
        const data = await response.json();
        setSubjectName(data.subject_name);
      } catch (error) {
        console.error("Error fetching subject details:", error);
      }
    };

    const fetchTopicDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/subjects/${subject_id}/topics/${topic_id}`
        );
        const data = await response.json();
        setTopicName(data.topic_name);
      } catch (error) {
        console.error("Error fetching topic details:", error);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/subjects/${subject_id}/topics/${topic_id}/questions`
        );
        const questionsData = await response.json();

        const formattedQuestions = questionsData.map((q) => ({
          id: q.question_id,
          title: q.question_text,
          answers: q.answers,
          testCases: q.test_cases,
          topic_id: q.topic_id,
          status: "pending", // You might want to check DoneQuestion table
        }));

        // Split between labs and homework based on topic association
        // You might want to adjust this logic based on your data structure
        setQuestions({
          labs: formattedQuestions.filter((q) => q.topic_id % 2 === 0), // Example split
          homework: formattedQuestions.filter((q) => q.topic_id % 2 === 1),
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchSubjectDetails();
    fetchTopicDetails();
    fetchQuestions();
  }, [subject_id, topic_id]);

  return (
    <DashboardContainer>
      <Header>
        <Title>
          Problems of {topicName}, {subjectName}
        </Title>
      </Header>

      <ContentSection>
        <Card>
          <CardTitle>Labs</CardTitle>
          <QuestionList>
            {questions.labs.map((question) => (
              <QuestionItem key={question.id}>
                <h3>{question.title}</h3>
                <p>Number of Test Cases: {question.testCases.length}</p>
                <p>Number of Answers: {question.answers.length}</p>
                <p>Status: {question.status}</p>
              </QuestionItem>
            ))}
          </QuestionList>
        </Card>

        <Card>
          <CardTitle>Homework</CardTitle>
          <QuestionList>
            {questions.homework.map((question) => (
              <QuestionItem key={question.id}>
                <h3>{question.title}</h3>
                <p>Number of Test Cases: {question.testCases.length}</p>
                <p>Number of Answers: {question.answers.length}</p>
                <p>Status: {question.status}</p>
              </QuestionItem>
            ))}
          </QuestionList>
        </Card>
      </ContentSection>
    </DashboardContainer>
  );
};

export default QuestionDashboard;
