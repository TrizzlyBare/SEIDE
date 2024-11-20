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
  CardImage,
  CardImageContainer,
  CardTextContainer,
  ChangingText,
  Card,
  InfoContainer,
  LecturersContainer,
  Column,
} from "./dashboard_styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userYear, setUserYear] = useState(null);
  const navigate = useNavigate();

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("No access token found");
        navigate("/");
        return;
      }

      console.log(
        "Sending token for role check:",
        token.substring(0, 10) + "..."
      );

      const response = await fetch("http://localhost:8000/api/role-check", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
          return;
        }
        throw new Error("Failed to fetch user role");
      }

      const data = await response.json();
      console.log("Role check response:", data);

      setUserRole(data.role);
      setUserYear(data.year);
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      if (error.message.includes("401")) {
        navigate("/");
      }
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token || !userRole) {
        console.error("Missing token or user role");
        return;
      }

      const url = `http://localhost:8000/subjects/${userRole}/${userYear}`;
      console.log("Fetching subjects with URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
          return;
        }
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Subjects data:", data);

      const filteredSubjects = filterSubjectsByRole(data);
      setSubjects(filteredSubjects);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubjectsByRole = (subjects) => {
    if (!userRole || !userYear) return [];

    if (userRole === "ADMIN") {
      // Admin can see all subjects
      return subjects;
    }

    // Extract year number from role (e.g., 'YEAR1' -> 1)
    const roleYear = userYear;

    // Filter subjects based on year
    return subjects.filter((subject) => {
      return subject.year === roleYear;
    });
  };

  // Check authentication on mount
  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole && userYear) {
      fetchSubjects();
    }
  }, [userRole, userYear]);

  useEffect(() => {
    if (userRole && userYear) {
      console.log(`Current user role: ${userRole}`);
      console.log(`Current user year: ${userYear}`);
      console.log("Available subjects:", subjects);
    }
  }, [userRole, userYear, subjects]);

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

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [show, setShow] = useState(true);

  const texts = ["Software Engineering", "Software can change the world"];

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setShow(true);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <Container>
      <Header>Home Page</Header>

      <Card>
        <CardImageContainer>
          <CardImage src="/images/IntroImage.jpeg" alt="Image" />
        </CardImageContainer>
        <CardTextContainer>
          <ChangingText show={show}>{texts[currentTextIndex]}</ChangingText>
        </CardTextContainer>
      </Card>

      <Header>Subjects</Header>

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
      <Header>Why study Software Engineering?</Header>
      <InfoContainer>
        It is hard to overstate the ubiquity of software nowadays. Every
        computer system is governed by software. Almost every human activity
        involves software in some form. Undoubtedly software industry is one of
        the largest and fastest growing industries in the world. Consequently,
        skilled software engineers are in high demand worldwide. As software
        becomes more and more complex, the programming skills and the
        rudimentary knowledge of software engineering that students obtained
        from traditional computer science and computer engineering curriculums
        are insufficient. The development of real-world software applications
        requires the skills in analysing the problem domain and the customer's
        requirement and the skills in designing the software from the topmost
        level down to the implementation level. Moreover, a software engineer
        must be able to use proper tools, techniques, and methodologies in order
        to produce the software in an efficient manner.
      </InfoContainer>

      <Header>Lecturers</Header>
      <LecturersContainer>
        <Column>
          <h3>Internal Lecturers</h3>
          <ul>
            <li>Dr. Montri Phothisonothai</li>
            <li>Dr. Ukrit Watchareeruetai</li>
            <li>Asst.Prof.Dr. Ronnachai Tiyarattanachai</li>
            <li>Assoc.Prof.Dr. Veera Boonjing</li>
            <li>Dr. Natthapong Jungteerapanich</li>
            <li>Asst.Prof.Dr. Chaiwat Nuthong</li>
            <li>Dr. Churirat Boonkhun</li>
            <li>Asst.Prof.Dr. Kulwadee Somboonviwat</li>
            <li>Dr. Pipat Sookavatana</li>
            <li>Asst.Prof.Dr. Chivalai Temiyasathit</li>
            <li>Dr. Jochen Amrehn</li>
            <li>Mr. Xavier Boegly</li>
            <li>Asst.Prof.Dr. Isara Anantavrasilp</li>
          </ul>
        </Column>
        <Column>
          <h3>External Lecturers</h3>
          <ul>
            <li>Asst.Prof.Dr. Visit Hirankitti</li>
            <li>Asst.Prof.Dr. Pratoom Angurarohita</li>
            <li>Dr. Prakash Chanchana</li>
            <li>Asst.Prof.Dr. Surin Kittitornkun</li>
            <li>Assoc.Prof.Dr. Suphamit Chittayasothorn</li>
            <li>Asst.Prof.Dr. Lily Ingsrisawang</li>
            <li>Dr. Vorapranee Khu-smith</li>
            <li>Assoc.Prof.Dr. Tatre Jantarakolica</li>
            <li>Assoc.Prof.Dr. Boontee Kruatrachue</li>
            <li>Asst.Prof.Dr. Todsanai Chumwatana</li>
            <li>Dr. Yunyong Teng-amnuay</li>
            <li>University of Glasgow Staff</li>
            <li>Dr. Rutchanee Gullayanon</li>
            <li>Asst.Prof.Dr. Kasin Vichienchom</li>
            <li>Dr. Teerawet Titseesang</li>
          </ul>
        </Column>
      </LecturersContainer>
    </Container>
  );
};

export default Dashboard;
