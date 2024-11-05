import React, { useState, useEffect } from "react";
import Admin from "../components/Admin/Admin";
import { getSubjects, createSubject } from "../api";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

const AdminPage = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async (subjects) => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleCreateSubject = async (subject) => {
    try {
      await createSubject(subject);
      fetchSubjects();
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="sidebar-container">
      <AdminSidebar subjects={subjects} addSubject={createSubject} />
      <Admin addSubject={handleCreateSubject} />
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
