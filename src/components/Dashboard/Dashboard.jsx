import React from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f4f4f4;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #333;
`;

const Content = styled.p`
  font-size: 16px;
  color: #666;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      <Content>
        Welcome to your dashboard! Here you can manage your account and
        settings.
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
