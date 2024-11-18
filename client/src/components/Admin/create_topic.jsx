import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

const AdminContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #333;
`;

const Content = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const CreateTopic = () => {
  const [newTopic, setNewTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { subjectName } = useParams();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newTopic.trim() !== "") {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/subjects/${subjectName}/topics`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic_name: newTopic,
              subject_name: subjectName,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to add topic");
        }

        setNewTopic("");
        navigate(`/admin/${subjectName}/create`);
      } catch (error) {
        console.error("Failed to add topic:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AdminContainer>
      <Title>Create Topic</Title>
      <Content>
        <Form onSubmit={handleFormSubmit}>
          <Input
            type="text"
            placeholder="Enter topic name"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={isLoading || newTopic.trim() === ""}>
            {isLoading ? "Adding..." : "Add Topic"}
          </Button>
        </Form>
      </Content>
    </AdminContainer>
  );
};

export default CreateTopic;
