import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

const CURRENT_USER_ID = 0; // Replace with actual current user ID

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("Year 1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/all_users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const sortedUsers = data.sort((a, b) => a.role.localeCompare(b.role));
      setUsers(sortedUsers);
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newSubject.trim() !== "") {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/subjects/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_name: newSubject,
            user_id: CURRENT_USER_ID,
            year: selectedYear,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to add subject");
        }

        setNewSubject("");
        setIsModalOpen(false);
        await fetchUsers(); // Refresh the user list after adding a new subject
      } catch (error) {
        alert(`Failed to add subject: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-users">
      <h1>Admin Users</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.role}</td>
              <td>{user.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
