import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import "../styles/CodeEditorPage.css";
import Sidebar from "../components/Sidebar/Sidebar";
import { getQuestionById } from "../api";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9f9f9;
`;

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #333;
  color: white;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  background-color: #fff;
  padding: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const QuestionDetails = styled.div`
  background-color: #fff;
  padding: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #333;
`;

const Description = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #555;
`;

const EditorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const CodeEditorPage = () => {
  const [question, setQuestion] = useState(null);
  const location = useLocation();

  const getQuestionIdFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("question_id");
  };

  const questionId = getQuestionIdFromQuery();

  useEffect(() => {
    if (questionId) {
      getQuestionById(questionId)
        .then((data) => {
          console.log("Fetched question:", data);
          setQuestion(data);
        })
        .catch((error) => {
          console.error("Failed to fetch question", error);
        });
    }
  }, [questionId]);

  return (
    <PageContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>

      <ContentContainer>
        <Header>
          <Title>
            {questionId
              ? `Editing Question ID: ${questionId}`
              : "No Question Selected"}
          </Title>
        </Header>

        {question && (
          <QuestionDetails>
            <Title>Problem Statement</Title>
            <Description>{question.question_text || "No description available"}</Description>
          </QuestionDetails>
        )}

        <EditorWrapper>
          <CodeEditor questionId={questionId} />
        </EditorWrapper>
      </ContentContainer>
    </PageContainer>
  );
};

export default CodeEditorPage;
