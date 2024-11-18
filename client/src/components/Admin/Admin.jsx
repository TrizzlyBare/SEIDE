import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  AdminContainer,
  Title,
  SubjectsGrid,
  SubjectBox,
  DeleteButton,
  ModalOverlay,
  ModalContent,
  Input,
  Button,
  YearSelection,
} from "./admin_styles";

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("Year 1");

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
      console.log("Fetched subjects:", data); // Check the API response here
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

  const handleSubjectClick = (subjectName) => {
    navigate(`/admin/${subjectName}`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== "") {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/subjects/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_name: newSubject,
            user_id: currentUserId,
            year: selectedYear,
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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const subjectsByYear = (year) => {
    return subjects.filter((subject) => subject.year === year);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AdminContainer>
      <Title>Subject Management</Title>

      <h2>Year 1</h2>
      <SubjectsGrid>
        {subjectsByYear("Year 1").map((subject) => (
          <SubjectBox
            key={subject.subject_id}
            onClick={() => handleSubjectClick(subject.subject_name)}
          >
            {subject.subject_name}
            <DeleteButton
              onClick={(e) => handleDeleteSubject(subject.subject_id, e)}
            >
              ×
            </DeleteButton>
          </SubjectBox>
        ))}
      </SubjectsGrid>

      <h2>Year 2</h2>
      <SubjectsGrid>
        {subjectsByYear("Year 2").map((subject) => (
          <SubjectBox
            key={subject.subject_id}
            onClick={() => handleSubjectClick(subject.subject_name)}
          >
            {subject.subject_name}
            <DeleteButton
              onClick={(e) => handleDeleteSubject(subject.subject_id, e)}
            >
              ×
            </DeleteButton>
          </SubjectBox>
        ))}
      </SubjectsGrid>

      <h2>Year 3</h2>
      <SubjectsGrid>
        {subjectsByYear("Year 3").map((subject) => (
          <SubjectBox
            key={subject.subject_id}
            onClick={() => handleSubjectClick(subject.subject_name)}
          >
            {subject.subject_name}
            <DeleteButton
              onClick={(e) => handleDeleteSubject(subject.subject_id, e)}
            >
              ×
            </DeleteButton>
          </SubjectBox>
        ))}
      </SubjectsGrid>

      <h2>Year 4</h2>
      <SubjectsGrid>
        {subjectsByYear("Year 4").map((subject) => (
          <SubjectBox
            key={subject.subject_id}
            onClick={() => handleSubjectClick(subject.subject_name)}
          >
            {subject.subject_name}
            <DeleteButton
              onClick={(e) => handleDeleteSubject(subject.subject_id, e)}
            >
              ×
            </DeleteButton>
          </SubjectBox>
        ))}
      </SubjectsGrid>

      <SubjectBox onClick={() => setIsModalOpen(true)}>
        + Add Subject
      </SubjectBox>

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

              <YearSelection>
                <input
                  type="radio"
                  value="Year 1"
                  name="Year"
                  checked={selectedYear === "Year 1"}
                  onChange={handleYearChange}
                />{" "}
                Year 1
                <input
                  type="radio"
                  value="Year 2"
                  name="Year"
                  checked={selectedYear === "Year 2"}
                  onChange={handleYearChange}
                />{" "}
                Year 2
                <input
                  type="radio"
                  value="Year 3"
                  name="Year"
                  checked={selectedYear === "Year 3"}
                  onChange={handleYearChange}
                />{" "}
                Year 3
                <input
                  type="radio"
                  value="Year 4"
                  name="Year"
                  checked={selectedYear === "Year 4"}
                  onChange={handleYearChange}
                />{" "}
                Year 4
              </YearSelection>

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
