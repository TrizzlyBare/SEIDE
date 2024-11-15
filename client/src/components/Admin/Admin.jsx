import React, { useState } from "react";
import styled from "styled-components";
import { createSubject } from "../../api";

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

const FeedbackMessage = styled.p`
  font-size: 14px;
  color: ${({ isError }) => (isError ? "red" : "green")};
`;

const Admin = () => {
  const [newSubject, setNewSubject] = useState("");
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const handleInputChange = (e) => {
    setNewSubject(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== "") {
      try {
        const subjectData = {
          subject_name: newSubject, // Use the exact field name expected by the backend
          user_id: 1, // Set user_id to the appropriate value; replace 1 with the actual user ID
        };
        console.log("Submitting subjectData:", subjectData);
        await createSubject(subjectData);
        setNewSubject("");
        alert("Subject added successfully");
      } catch (error) {
        console.error("Failed to add subject:", error);
        if (error.detail) {
          console.error("Validation issues:", error.detail);
          alert("Failed to add subject due to validation errors: " + JSON.stringify(error.detail));
        } else {
          alert("Failed to add subject: " + JSON.stringify(error));
        }
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
        {feedback.message && (
          <FeedbackMessage isError={feedback.isError}>
            {feedback.message}
          </FeedbackMessage>
        )}
      </Content>
    </AdminContainer>
  );
};

export default Admin;