import React, { useState, useEffect } from "react";
import Admin from "../components/Admin/Admin";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { getSubjects } from "../api";

const AdminPage = () => {
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

  const refreshSubjects = () => {
    fetchSubjects();
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="sidebar-container">
      <AdminSidebar subjects={subjects} addSubject={refreshSubjects} />
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
