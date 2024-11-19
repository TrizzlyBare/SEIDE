import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  DashboardContainer,
  SubjectList,
  Subject,
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
      const response = await fetch("http://localhost:8000/subjects/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error(
          "Failed to fetch subjects: ",
          response.status,
          response.statusText
        );
        setSubjects([]);
        return;
      }

      const data = await response.json();
      console.log("Fetched subjects data:", data);

      if (Array.isArray(data)) {
        const enrichedData = data.map((subject, index) => ({
          ...subject,
          id: subject.id || `subject-${index}`,
          subcategories: Array.isArray(subject.subcategories)
            ? subject.subcategories.map((subcategory, subIndex) => ({
                ...subcategory,
                id: subcategory.id || `subcategory-${index}-${subIndex}`,
              }))
            : [],
        }));
        setSubjects(enrichedData);
      } else {
        console.error("Fetched data is not an array:", data);
        setSubjects([]);
      }
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

  const handleSubjectClick = (subjectId) => {
    navigate(`/subjects/${subjectId}/topics`);
  };

  return (
    <Container>
      <Header>Home Page</Header>
      <DashboardContainer>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <SubjectList>
            {subjects.map((subject) => (
              <div key={subject.id}>
                <Subject onClick={() => handleSubjectClick(subject.id)}>
                  {subject.subject_name}
                </Subject>
                {expandedSubject === subject.id && (
                  <SubcategoryList>
                    {subject.subcategories.map((subcategory) => (
                      <Subcategory
                        key={subcategory.id}
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
