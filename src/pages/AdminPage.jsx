import React, { useState, useEffect } from "react";
import Admin from "../components/Admin/Admin";
// import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

const API_URL = "http://127.0.0.1:8000";

const AdminPage = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_URL}/subjects/`);
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const createSubject = async (subject) => {
    try {
      console.log("Sending payload:", subject); // Log the payload
      const response = await fetch(`${API_URL}/subjects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText); // Log the error response
        throw new Error("Failed to create subject");
      }
      await response.json();
      fetchSubjects(); // Refresh subjects after creating a new one
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="sidebar-container">
      {/* <AdminSidebar subjects={subjects} addSubject={createSubject} /> */}
      <Admin addSubject={createSubject} />
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
