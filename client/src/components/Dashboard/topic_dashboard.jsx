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
  const [subjectName, setSubjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { subject_id } = useParams();
  const navigate = useNavigate();

  const fetchSubjectDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/subjects/${subject_id}`
      );
      if (!response.ok) {
        throw new Error("Subject not found");
      }
      const data = await response.json();
      setSubjectName(data.subject_name);
    } catch (error) {
      setError("Failed to load subject details");
      navigate("/subjects");
    }
  };

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8000/subjects/${subject_id}/topics`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }

      const data = await response.json();
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
    if (subject_id) {
      fetchSubjectDetails();
      fetchTopics();
    }
  }, [subject_id]);

  return (
    <Container>
      <Header>
        {subjectName ? `Topics for ${subjectName}` : "Topics"}
        <button
          onClick={() => navigate("/subjects")}
          style={{
            marginLeft: "10px",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          Back to Subjects
        </button>
      </Header>
      <DashboardContainer>
        {error && <p className="error">{error}</p>}
        {isLoading ? (
          <p>Loading topics...</p>
        ) : topics.length === 0 ? (
          <p>No topics found for this subject</p>
        ) : (
          <SubjectList>
            {topics.map((topic) => (
              <Subject key={topic.topic_id}>{topic.topic_name}</Subject>
            ))}
          </SubjectList>
        )}
      </DashboardContainer>
    </Container>
  );
};

export default TopicDashboard;
