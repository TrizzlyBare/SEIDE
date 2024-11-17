import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-start; /* Ensure content starts from the left */
`;

const SubjectBox = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #333;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;

  &:hover {
    background-color: #f0f0f0;
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
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 700px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
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
  width: 100%;

  &:hover {
    background-color: #555;
  }
`;

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/subjects/");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewSubject("");
  };

  const handleInputChange = (e) => {
    setNewSubject(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== "") {
      try {
        const response = await fetch("http://localhost:8000/subjects/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newSubject }),
        });

        if (!response.ok) {
          throw new Error("Failed to add subject");
        }

        setNewSubject("");
        setIsModalOpen(false);
        alert("Subject added successfully");
        fetchSubjects();
      } catch (error) {
        console.error("Failed to add subject", error);
      }
    }
  };

  return (
    <AdminContainer>
      <Title>Admin Page</Title>
      <SubjectsGrid>
        {subjects.map((subject, index) => (
          <SubjectBox key={index}>{subject.name}</SubjectBox>
        ))}
        <SubjectBox>Subject 1</SubjectBox>
        <SubjectBox>Subject 2</SubjectBox>
        <SubjectBox onClick={handleOpenModal}>+</SubjectBox>
      </SubjectsGrid>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleFormSubmit}>
              <Input
                type="text"
                placeholder="Enter new subject"
                value={newSubject}
                onChange={handleInputChange}
              />
              <Button type="submit">Add Subject</Button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AdminContainer>
  );
};

export default Admin;
