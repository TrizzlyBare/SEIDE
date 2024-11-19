import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  DashboardContainer,
  SubjectList,
  Subject,
  SubjectTitle,
  ViewTopicsButton,
  SubcategoryList,
  Subcategory,
} from "./dashboard_styles";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/subjects/");

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectClick = (subject) => {
    setExpandedSubject(
      expandedSubject === subject.subject_id ? null : subject.subject_id
    );
  };

  const handleSubjectNavigate = (subject) => {
    if (!subject?.subject_id) {
      console.error("Invalid subject ID:", subject);
      return;
    }
    navigate(`/subjects/${subject.subject_id}/topics`);
  };

  return (
    <Container>
      <Header>Home Page</Header>
      <DashboardContainer>
        {isLoading ? (
          <p>Loading...</p>
        ) : subjects.length === 0 ? (
          <p>No subjects found</p>
        ) : (
          <SubjectList>
            {subjects.map((subject) => (
              <div key={`subject-${subject.subject_id}`}>
                <Subject>
                  <SubjectTitle onClick={() => handleSubjectClick(subject)}>
                    {subject.subject_name}
                  </SubjectTitle>
                  <ViewTopicsButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubjectNavigate(subject);
                    }}
                  >
                    View Topics
                  </ViewTopicsButton>
                </Subject>
                {expandedSubject === subject.subject_id &&
                  subject.subcategories && (
                    <SubcategoryList>
                      {subject.subcategories.map((subcategory, subIndex) => (
                        <Subcategory
                          key={`subcategory-${subject.subject_id}-${subIndex}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSubcategoryClick(
                              subject.subject_name,
                              subcategory.subcategory_name
                            );
                          }}
                        >
                          {subcategory.subcategory_name}
                        </Subcategory>
                      ))}
                    </SubcategoryList>
                  )}
              </div>
            ))}
          </SubjectList>
        )}
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;
