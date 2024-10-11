import React, { useState, useEffect } from "react";
import Admin from "../components/Admin/Admin";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { getTopics } from "../api";

const AdminPage = () => {
  const [topics, setTopics] = useState([]);

  const fetchTopics = async () => {
    try {
      const data = await getTopics();
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
      <Admin addSubject={refreshSubjects} />
      <div>
        <h2>Subjects List</h2>
        <ul>
          {subjects.map((subject) => (
            <li key={subject.id}>{subject.name}</li>
          ))}
        </ul> 
      </div>
    </div>
  );
};

export default AdminPage;
