import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createTopic, getTopics } from "../../api"; // Assuming the API method for topics is createTopic
import { useLocation } from "react-router-dom";

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

const Admin = ({ addTopic }) => {
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const location = useLocation();

  // Extract the "id" from the query string
  const getIdFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("id"); // Returns the value of "id" or null if not present
  };

  const id = getIdFromQuery(); // Get the ID from the URL query

  const fetchTopics = async () => {
    try {
      console.log("Fetching topics...");
      const data = await getTopics(id);
      console.log("Fetched data:", data);
      if (Array.isArray(data)) {
        setTopics(data);
      } else {
        console.error("Fetched data is not an array", data);
        setTopics([]);
      }
    } catch (error) {
      console.error("Failed to fetch topics", error);
      setTopics([]);
    }
  };

  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      window.location.href = "/signin";
    }
    fetch("http://localhost:8000/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Use the token stored in localStorage
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
        window.location.href = "/signin";
      });
  };

  useEffect(() => {
    if (id) {
      console.log("Received ID:", id);
    }
    fetchTopics();
    checkLogin();
  }, [id]);

  const handleInputChange = (e) => {
    setNewTopic(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newTopic.trim() !== "") {
      try {
        await createTopic(id,newTopic);
        setNewTopic("");
        alert("Topic added successfully");
        addTopic();
      } catch (error) {
        console.error("Failed to add topic", error);
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
            placeholder="Enter new topic"
            value={newTopic}
            onChange={handleInputChange}
          />
          <Button type="submit">Add Topic</Button>
        </Form>
        <div>
        <h2>Topics List</h2>
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <a href={`/admin/create_question?id=${topic.topic_id}`}>
                {topic.topic_name}
                </a>
              </li>
          ))}
        </ul>
      </div>
      </Content>
    </AdminContainer>
  );
};

export default Admin;
