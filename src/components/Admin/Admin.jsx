import React, { useState } from "react";
import styled from "styled-components";

const AdminContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const Admin = () => {
  const [newSubject, setNewSubject] = useState("");

  const handleInputChange = (e) => {
    setNewSubject(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== "") {
      // Call the API to add the subject to the database
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newSubject }),
      });

      if (response.ok) {
        setNewSubject("");
        alert("Subject added successfully");
      } else {
        console.error("Failed to add subject");
      }
    }
  };

  return (
    <AdminContainer>
      <Title>Admin Page</Title>
      <Content>
        <Form onSubmit={handleFormSubmit}>
          <Input
            type="text"
            placeholder="Enter new subject"
            value={newSubject}
            onChange={handleInputChange}
          />
          <Button type="submit">Add Subject</Button>
        </Form>
      </Content>
    </AdminContainer>
  );
};

export default Admin;
