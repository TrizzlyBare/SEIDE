import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import { getSubjects } from "../api"; // Import the getSubjects function

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

  return <Dashboard subjects={subjects} />;
};

export default HomePage;
