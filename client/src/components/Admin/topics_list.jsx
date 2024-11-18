import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

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

const TopicsList = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { subject_id } = useParams(); // Extract subject_id from route parameters

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TopicsContainer>
      <Title>Topics List</Title>
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

export default TopicsList;
