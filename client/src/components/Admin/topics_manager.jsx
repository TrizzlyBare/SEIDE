import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

// Existing styled components remain the same
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

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #ff4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.2s ease;

  &:hover {
    background-color: #ff0000;
  }
`;

const TopicBox = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background: white;
  padding: 15px;
  text-align: center;
  word-break: break-word;
  position: relative;

  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

const AddTopicBox = styled(TopicBox)`
  border: 2px dashed #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #999;
    background-color: #f8f8f8;
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

// New Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #333;
  color: white;

  &:hover:not(:disabled) {
    background-color: #444;
  }
`;

const TopicsManager = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { subject_id } = useParams();

  const fetchSubjectDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/subjects/${subject_id}`
      );
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

  const handleAddTopic = async (e) => {
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
      setIsModalOpen(false);
      fetchTopics();
    } catch (error) {
      console.error("Failed to add topic:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this topic?")) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8000/subjects/${subject_id}/topics/${topicId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to delete topic");
        }

        // Refresh topics list after successful deletion
        await fetchTopics();
      } catch (error) {
        console.error("Error deleting topic:", error);
        setError(`Failed to delete topic: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate("/admin");
  };

  return (
    <TopicsContainer>
      <BackButton onClick={handleBack}>← Back to Subjects</BackButton>

      <Title>
        {subjectName ? `Topics for ${subjectName}` : "Topics Management"}
      </Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isLoading ? (
        <LoadingSpinner>Loading...</LoadingSpinner>
      ) : (
        <TopicsGrid>
          <AddTopicBox onClick={() => setIsModalOpen(true)}>
            <div>
              <span style={{ fontSize: "24px", display: "block" }}>+</span>
              <span>Add New Topic</span>
            </div>
          </AddTopicBox>

          {topics.map((topic) => (
            <TopicBox key={topic.topic_id}>
              {topic.topic_name}
              <DeleteButton
                onClick={(e) => handleDeleteTopic(topic.topic_id, e)}
              >
                ×
              </DeleteButton>
            </TopicBox>
          ))}
        </TopicsGrid>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Add New Topic</ModalTitle>
            <form onSubmit={handleAddTopic}>
              <Input
                type="text"
                placeholder="Enter topic name"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <ButtonGroup>
                <CancelButton
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </CancelButton>
                <SubmitButton
                  type="submit"
                  disabled={isLoading || newTopic.trim() === ""}
                >
                  {isLoading ? "Adding..." : "Add Topic"}
                </SubmitButton>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </TopicsContainer>
  );
};

export default TopicsManager;
