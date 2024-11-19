import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

const TopicsContainer = styled.div`
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

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
`;

const TopicBox = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  background: white;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TopicsManager = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { subject_id } = useParams(); 

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/subjects/${subject_id}/topics`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching topics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [subject_id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newTopic.trim() !== "") {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/subjects/${subject_id}/topics`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic_name: newTopic,
              subject_id: parseInt(subject_id),
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to add topic");
        }

        setNewTopic("");
        fetchTopics(); // Refresh the topics list
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
    <TopicsContainer>
      <Title>Topics Management</Title>
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TopicsGrid>
          {topics.map((topic) => (
            <TopicBox key={topic.topic_id}>{topic.topic_name}</TopicBox>
          ))}
        </TopicsGrid>
      )}
    </TopicsContainer>
  );
};

export default TopicsManager;
