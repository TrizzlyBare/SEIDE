import React from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar/Sidebar";

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #dbe2ef;
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

const Content = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  text-align: left;
`;

const SubjectList = styled.ul`
  list-style-type: none;
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

const Container = styled.div`
  display: flex;
`;

const Dashboard = ({ subjects = [] }) => {
  console.log("Dashboard subjects:", subjects);

  return (
    <Container>
      <Sidebar />
      <DashboardContainer>
        <Title>Dashboard</Title>
        <Content>
          <SubjectList>
            {subjects.map((subject, index) => (
              <SubjectItem key={index}>{subject}</SubjectItem>
            ))}
          </SubjectList>
        </Content>
      </DashboardContainer>
    </Container>
  );
};

export default Dashboard;
