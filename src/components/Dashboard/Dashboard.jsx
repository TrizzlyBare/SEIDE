import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar/Sidebar";
import { getSubjects } from "../../api";

const Container = styled.div`
  display: flex;
`;

const DashboardContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Content = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubjectList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SubjectItem = styled.li`
  padding: 10px;
  background-color: #fff;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        console.error("Fetched data is not an array", data);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch subjects", error);
      setSubjects([]);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Container>
      <Sidebar />
      <DashboardContainer>
        <Title>Dashboard</Title>
        <Content>
          <SubjectList>
            {subjects.map((subject, index) => (
              <SubjectItem key={index}>{subject.name}</SubjectItem>
            ))}
          </SubjectList>
        </Content>
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;
