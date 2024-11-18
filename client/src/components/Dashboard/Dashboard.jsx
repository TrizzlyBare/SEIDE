import React, { useState, useEffect } from "react";
import {
  Container,
  DashboardContainer,
  Title,
  Content,
  SubjectsGrid,
  SubjectBox,
} from "./dashboard_styles";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/subjects/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.error("Fetched data is not an array", data);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch subjects", error);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectClick = (subjectName) => {
    navigate(`/${subjectName}`);
  };

  return (
    <Container>
      <DashboardContainer>
        <Title>Home</Title>
        <Content>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <SubjectsGrid>
              {subjects.map((subject, index) => (
                <SubjectBox
                  key={index}
                  onClick={() => handleSubjectClick(subject.subject_name)}
                >
                  {subject.subject_name}
                </SubjectBox>
              ))}
            </SubjectsGrid>
          )}
        </Content>
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;

{
  /* <SubjectItem key={index}>{subject.subject_name}</SubjectItem> */
}
