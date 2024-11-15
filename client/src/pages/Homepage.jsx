import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/Dashboard.css";
import { getSubjects } from "../api";

const HomePage = () => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="Dashboard-page">
      <Dashboard subjects={subjects} />
    </div>
  );
};

export default HomePage;
