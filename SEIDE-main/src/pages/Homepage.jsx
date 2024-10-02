import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";

const HomePage = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch("/api/subjects");
      const data = await response.json();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  return <Dashboard subjects={subjects} />;
};

export default HomePage;
