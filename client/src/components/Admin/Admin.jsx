import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
`;

const SubjectBox = styled.div`
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

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  ${SubjectBox}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #ff0000;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #333;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #555;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [year, setYear] = useState(""); // Add state for year
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const currentUserId = 1;

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/subjects/");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (subjectId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/subjects/${subjectId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete subject");
        }

        await fetchSubjects();
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete subject");
      }
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/admin/${subjectId}/create`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== "") {
      // Check if year is not empty
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/subjects/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_name: newSubject,
            user_id: currentUserId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to add subject");
        }

        setNewSubject("");
        setIsModalOpen(false);
        await fetchSubjects();
      } catch (error) {
        console.error("Failed to add subject:", error);
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
      <Title>Subject Management</Title>
      <SubjectsGrid>
        {subjects.map((subject) => (
          <SubjectBox
            key={subject.subject_id}
            onClick={() => handleSubjectClick(subject.subject_id)}
          >
            {subject.subject_name}
            <DeleteButton
              onClick={(e) => handleDeleteSubject(subject.subject_id, e)}
            >
              ×
            </DeleteButton>
          </SubjectBox>
        ))}
        <SubjectBox onClick={() => setIsModalOpen(true)}>
          + Add Subject
        </SubjectBox>
      </SubjectsGrid>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleFormSubmit}>
              <Input
                type="text"
                placeholder="Enter subject name"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                disabled={isLoading || newSubject.trim() === ""}
              >
                {isLoading ? "Adding..." : "Add Subject"}
              </Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AdminContainer>
  );
};

export default Admin;
