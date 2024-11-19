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
      console.log("Raw subjects data:", data); // Debug log for raw data

      if (Array.isArray(data)) {
        const enrichedData = data.map((subject, index) => {
          // Log each subject to debug
          console.log("Processing subject:", subject);
          
          return {
            ...subject,
            // Fallback to index if id is undefined
            id: subject.id || index,
            subject_name: subject.subject_name || 'Unnamed Subject',
            subcategories: Array.isArray(subject.subcategories)
              ? subject.subcategories.map((subcategory, subIndex) => ({
                  ...subcategory,
                  id: subcategory.id || `sub-${index}-${subIndex}`,
                  subcategory_name: subcategory.subcategory_name || 'Unnamed Subcategory'
                }))
              : []
          };
        });
        
        console.log("Enriched data:", enrichedData); // Debug log for processed data
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

  const handleSubjectClick = (subject) => {
    console.log("Clicked subject:", subject); // Debug log
    setExpandedSubject(expandedSubject === subject.id ? null : subject.id);
  };

  const handleSubjectNavigate = (subject) => {
    console.log("Navigating to subject:", subject); // Debug log
    if (subject.id === undefined) {
      console.error("Subject ID is undefined:", subject);
      return;
    }
    navigate(`/subjects/${subject.id}/topics`);
  };

  const handleSubcategoryClick = (subjectName, subcategoryName) => {
    console.log(`Clicked subcategory ${subcategoryName} of subject ${subjectName}`);
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
            {subjects.map((subject, index) => {
              // Debug log for rendering
              console.log("Rendering subject:", subject);
              
              return (
                <div key={`subject-${subject.id || index}`}>
                  <Subject>
                    <div
                      onClick={() => handleSubjectClick(subject)}
                      style={{ flex: 1, cursor: "pointer" }}
                    >
                      {subject.subject_name || 'Unnamed Subject'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubjectNavigate(subject);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                        marginLeft: "10px",
                        padding: "4px 8px",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      View Topics
                    </button>
                  </Subject>
                  {expandedSubject === subject.id && (
                    <SubcategoryList>
                      {subject.subcategories.map((subcategory, subIndex) => (
                        <Subcategory
                          key={`subcategory-${subject.id || index}-${subcategory.id || subIndex}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSubcategoryClick(
                              subject.subject_name,
                              subcategory.subcategory_name
                            );
                          }}
                        >
                          {subcategory.subcategory_name || 'Unnamed Subcategory'}
                        </Subcategory>
                      ))}
                    </SubcategoryList>
                  )}
                </div>
              );
            })}
          </SubjectList>
        )}
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;