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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("No access token found");
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:8000/api/role-check", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Role check response:", data);

      setUserRole(data.role);
      setUserYear(data.year);
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      setError("Failed to authenticate user");
      navigate("/");
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");

      if (!token || !userRole) {
        console.error("Missing token or user role");
        return;
      }

      // Construct the URL with role and year
      const yearParam = userRole === "ADMIN" ? 0 : userYear; // Use 0 for admin
      const url = `http://localhost:8000/subjects/${userRole}/${yearParam}`;

      console.log("Fetching subjects with URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched subjects:", data);

      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setError("Failed to load subjects");
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole && (userYear || userRole === "ADMIN")) {
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

  if (error) {
    return (
      <Container>
        <Header>Error</Header>
        <div style={{ color: "red", padding: "20px" }}>{error}</div>
      </Container>
    );
  }

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

      <Header>
        {userRole === "ADMIN" ? "All subjects" : `Year ${userYear} Subjects`}
      </Header>

      <DashboardContainer>
        {isLoading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p>
            No subjects found{" "}
            {userRole !== "ADMIN" ? `for Year ${userYear}` : ""}
          </p>
        ) : (
          <SubjectList>
            {subjects.map((subject) => (
              <div key={`subject-${subject.subject_id}`}>
                <Subject>
                  <SubjectTitle onClick={() => handleSubjectClick(subject)}>
                    {subject.subject_name}
                    {userRole === "ADMIN" && (
                      <span
                        style={{
                          fontSize: "0.8em",
                          color: "#666",
                          marginLeft: "10px",
                        }}
                      >
                        ({subject.year})
                      </span>
                    )}
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
