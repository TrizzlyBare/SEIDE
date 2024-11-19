import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Header,
  DashboardContainer,
  SubjectList,
  Subject,
} from "./dashboard_styles";

const TopicDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { subject_id } = useParams();
  const navigate = useNavigate();

  const fetchTopics = async () => {
    if (!subject_id || subject_id === "0") {
      setError("Invalid subject ID");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching topics for subject_id:", subject_id);

      // Fix: Use template literal for proper URL construction
      const response = await fetch(
        `http://localhost:8000/subjects/${subject_id}/topics`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch topics: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched topics:", data);

      // No need to filter as the API already returns filtered topics
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setError(error.message);
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [subject_id]);

  // Function to validate if we have a valid subject_id
  const isValidSubjectId = (id) => {
    return id && id !== "0" && !isNaN(parseInt(id));
  };

  return (
    <Container>
      <Header>
        {isValidSubjectId(subject_id)
          ? `Topics for Subject ${subject_id}`
          : "Invalid Subject ID"}
        <button
          onClick={() => navigate("/subjects")}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            borderRadius: "4px",
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Subjects
        </button>
      </Header>
      <DashboardContainer>
        {isLoading ? (
          <p>Loading topics...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : !isValidSubjectId(subject_id) ? (
          <p>Invalid subject ID. Please select a valid subject.</p>
        ) : topics.length === 0 ? (
          <p>No topics found for this subject</p>
        ) : (
          <SubjectList>
            {topics.map((topic) => (
              <Subject
                key={topic.topic_id}
                style={{
                  padding: "15px",
                  marginBottom: "10px",
                  background: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {topic.topic_name}
              </Subject>
            ))}
          </SubjectList>
        )}
      </DashboardContainer>
    </Container>
  );
};

export default TopicDashboard;
