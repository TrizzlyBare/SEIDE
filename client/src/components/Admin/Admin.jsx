import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminContainer,
  Title,
  SubjectsGrid,
  SubjectBox,
  SubjectAddingBox,
  DeleteButton,
  ModalOverlay,
  ModalContent,
  Input,
  Button,
  YearSelection,
  YearTitle,
  Divider,
} from "./admin_styles";

const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4"];
const CURRENT_USER_ID = 0;

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);

  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8000/subjects/");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch subjects");
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

  const handleDeleteSubject = async (subjectId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/subjects/${subjectId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to delete subject");
        }

        await fetchSubjects();
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert(`Failed to delete subject: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/admin/${subjectId}/create`);
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
            user_id: CURRENT_USER_ID,
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

  if (error) return <div>Error: {error}</div>;

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <AdminContainer>
      <Title>
        <span className="subject">Subject</span>
        <br />
        <span className="management">Management</span>
      </Title>



      {YEARS.map((year, yearIndex) => {
          const yearSubjects = subjects.filter(
            (subject) => subject.year === year
          );

          if (yearSubjects.length === 0) return null;

          return (
            <div
              key={`year-section-${yearIndex}`}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column", // Ensures year and subjects stack vertically
                alignItems: "stretch",  // Aligns everything to the container's width
              }}
            >
              <YearTitle>{year}</YearTitle>
              <SubjectsGrid>
                {yearSubjects.map((subject) => (
                  <SubjectBox
                    key={`subject-${subject.subject_id}`}
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
              </SubjectsGrid>
              {/* Add divider unless it's the last section */}
              {yearIndex < YEARS.length - 1 && <Divider />}
            </div>
          );
        })}




      <SubjectAddingBox onClick={() => setIsModalOpen(true)}>
        + Add Subject
      </SubjectAddingBox>

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
                {YEARS.map((year, index) => (
                  <label key={`year-radio-${index}`}>
                    <input
                      type="radio"
                      value={year}
                      name="Year"
                      checked={selectedYear === year}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    />{" "}
                    {year}
                  </label>
                ))}
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
