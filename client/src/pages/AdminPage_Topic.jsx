import React, { useState, useEffect } from "react";
import CreateTopic from "../components/Admin/create_topic";
import { getTopics } from "../api";

const AdminPage = () => {
  const [topics, setTopics] = useState([]);

  const fetchTopics = async () => {
    try {
      console.log("Fetching topics...");
      const data = await getTopics();
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

  const refreshTopics = () => {
    fetchTopics();
  };

  useEffect(() => { 
    fetchTopics();
  }, []);

  return (
    <div className="sidebar-container">
      <AdminSidebar />
      <CreateTopic refreshTopics={refreshTopics} />
      <div>
        <h2>Topics List</h2>
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>{topic.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;