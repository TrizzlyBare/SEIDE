import React, { useState, useEffect } from "react";
import Admin from "../components/Admin/Admin";
import { getSubjects, createSubject } from "../api";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

const AdminPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubjects();
      console.log(data); // Log the data to inspect the structure
      setSubjects(data);
    } catch (error) {
      setError("Failed to fetch subjects. Please try again later.");
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (subject) => {
    try {
      setCreating(true);
      await createSubject(subject);
      await fetchSubjects();
    } catch (error) {
      setError("Failed to create subject. Please try again.");
      console.error("Error creating subject:", error);
    } finally {
      setCreating(false);
    }
  };

  const checkLogin = () => {
    console.log(window.localStorage.getItem("token"));
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    } else {
      print("Checking login status");
      fetch(
        "http://localhost:8000/api/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
          
        } 
      ).then((response) => {
          if (!response.ok) {
            window.location.href = "/login";
          }
        })
        .catch((error) => {
          console.error("Error checking login status:", error);
          window.location.href = "/login";
        });
    }
  }

  useEffect(() => {
    fetchSubjects();
    checkLogin();
  }, []);

  return (
    <div className="sidebar-container">
      <AdminSidebar subjects={subjects} addSubject={handleCreateSubject} />
      <Admin addSubject={handleCreateSubject} />
      <div>
        <h2>Subjects List</h2>
        {loading ? (
          <div>Loading subjects...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <ul>
            {subjects.map((subject, index) => (
              <li key={subject.id || index}>
                {subject.subject_name} {/* Display the subject name correctly */}
              </li>
            ))}
          </ul>
        )}
        {creating && <div>Creating subject...</div>}
      </div>
    </div>
  );
};

export default AdminPage;