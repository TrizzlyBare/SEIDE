import React, { useState, useEffect } from "react";
import Admin from "../components/Admin/Admin";
import { getSubjects, createSubject } from "../api";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import DonutChart from "../components/Admin/DonutChart";

const AdminPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [completionData, setCompletionData] = useState({
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        label: 'Work Completion',
        data: [70, 30], // Example data, replace with actual data
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  });

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="sidebar-container">
      <AdminSidebar subjects={subjects} addSubject={createSubject} />
      <div>
        <h2>Overall Work Completion</h2>
        <DonutChart data={completionData} />
      </div>
    </div>
  );
};

export default AdminPage;