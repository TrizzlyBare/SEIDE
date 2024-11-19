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

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
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

const TopicsBox = styled.div`
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
  padding: 15px;
  text-align: center;
  word-break: break-word;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const BackButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;

  &:hover {
    background-color: #555;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  margin: 20px 0;
  font-size: 16px;
  color: #666;
`;

// const TopicBox = styled.div`
//   aspect-ratio: 1;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border: 2px solid #e0e0e0;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 16px;
//   color: #333;
//   background: white;
//   transition: all 0.2s ease;
//   position: relative;
//   padding: 15px;
//   text-align: center;
//   word-break: break-word;
// `;

const TopicsManager = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjectName, setSubjectName] = useState("");

  const navigate = useNavigate();
  const { subject_id } = useParams();

  const fetchSubjectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/subjects/${subject_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subject details");
      }
      const data = await response.json();
      setSubjectName(data.subject_name);
    } catch (error) {
      console.error("Error fetching subject details:", error);
      setError("Failed to load subject details");
    }
  };

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8000/subjects/${subject_id}/topics`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch topics");
      }
      
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!subject_id) {
      setError("No subject ID provided");
      return;
    }
    
    fetchSubjectDetails();
    fetchTopics();
  }, [subject_id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newTopic.trim() === "") return;

    try {
      setIsLoading(true);
      setError(null);
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
      fetchTopics();
    } catch (error) {
      console.error("Failed to add topic:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <TopicsContainer>
      <BackButton onClick={handleBack}>← Back to Subjects</BackButton>
      
      <Title>
        {subjectName ? `Topics for ${subjectName}` : 'Topics Management'}
      </Title>

      <Content>
        <Form onSubmit={handleFormSubmit}>
          <Input
            type="text"
            placeholder="Enter topic name"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || newTopic.trim() === ""}>
            {isLoading ? "Adding..." : "Add Topic"}
          </Button>
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Content>

      {isLoading ? (
        <LoadingSpinner>Loading...</LoadingSpinner>
      ) : (
        <TopicsGrid>
          {topics.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666" }}>
              No topics yet. Add your first topic above.
            </div>
          ) : (
            topics.map((topic) => (
              <TopicBox key={topic.topic_id}>{topic.topic_name}</TopicBox>
            ))
          )}
        </TopicsGrid>
      )}

    <TopicsBox onClick={() => setIsModalOpen(true)}><TopicsBox/>
    </TopicsContainer>
  );
};

export default TopicsManager;