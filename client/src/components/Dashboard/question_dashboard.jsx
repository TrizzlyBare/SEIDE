import React, { useState, useEffect } from "react";
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

const DashboardHome = () => {
  const [labQuestions, setLabQuestions] = useState([
    {
      id: 1,
      title: "Lab 1: Data Structures Implementation",
      dueDate: "2024-11-25",
      status: "pending",
    },
    {
      id: 2,
      title: "Lab 2: Algorithm Analysis",
      dueDate: "2024-11-28",
      status: "completed",
    },
    {
      id: 3,
      title: "Lab 3: Database Design",
      dueDate: "2024-12-01",
      status: "pending",
    },
  ]);

  const [homeworkQuestions, setHomeworkQuestions] = useState([
    {
      id: 1,
      title: "Homework 1: Programming Fundamentals",
      dueDate: "2024-11-24",
      status: "pending",
    },
    {
      id: 2,
      title: "Homework 2: Object-Oriented Design",
      dueDate: "2024-11-27",
      status: "pending",
    },
    {
      id: 3,
      title: "Homework 3: Web Development Basics",
      dueDate: "2024-11-30",
      status: "completed",
    },
  ]);

  return (
    <DashboardContainer>
      <Header>
        <Title>Student Dashboard</Title>
      </Header>

      <ContentSection>
        <Card>
          <CardTitle>Labs</CardTitle>
          <QuestionList>
            {labQuestions.map((question) => (
              <QuestionItem key={question.id}>
                <h3>{question.title}</h3>
                <p>Due: {new Date(question.dueDate).toLocaleDateString()}</p>
                <p>Status: {question.status}</p>
              </QuestionItem>
            ))}
          </QuestionList>
        </Card>

        <Card>
          <CardTitle>Homework</CardTitle>
          <QuestionList>
            {homeworkQuestions.map((question) => (
              <QuestionItem key={question.id}>
                <h3>{question.title}</h3>
                <p>Due: {new Date(question.dueDate).toLocaleDateString()}</p>
                <p>Status: {question.status}</p>
              </QuestionItem>
            ))}
          </QuestionList>
        </Card>
      </ContentSection>
    </DashboardContainer>
  );
};

export default DashboardHome;