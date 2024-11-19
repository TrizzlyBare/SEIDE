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
  const { subject_id } = useParams();
  const navigate = useNavigate();

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching topics for subject_id:", subject_id); // Debug log

      const response = await fetch("http://localhost:8000/topics/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("Failed to fetch topics:", response.status, response.statusText);
        setTopics([]);
        return;
      }

      const data = await response.json();
      console.log("All topics data:", data); // Debug log

      // Make sure subject_id is treated as a number for comparison
      const subjectIdNum = parseInt(subject_id);
      console.log("Looking for topics with subject_id:", subjectIdNum); // Debug log

      const subjectTopics = data.filter(topic => {
        console.log("Comparing topic subject_id:", topic.subject_id, "with:", subjectIdNum);
        return topic.subject_id === subjectIdNum;
      });

      console.log("Filtered topics:", subjectTopics); // Debug log
      setTopics(subjectTopics);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subject_id) {
      fetchTopics();
    }
  }, [subject_id]);

  return (
    <Container>
      <Header>
        Topics for Subject {subject_id}
        <button
          onClick={() => navigate('/subjects')}
          style={{
            marginLeft: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          Back to Subjects
        </button>
      </Header>
      <DashboardContainer>
        {isLoading ? (
          <p>Loading topics...</p>
        ) : topics.length === 0 ? (
          <p>No topics found for this subject</p>
        ) : (
          <SubjectList>
            {topics.map((topic) => (
              <Subject key={topic.id || `topic-${topic.topic_name}`}>
                {topic.topic_name || 'Unnamed Topic'}
              </Subject>
            ))}
          </SubjectList>
        )}
      </DashboardContainer>
    </Container>
  );
};

export default TopicDashboard;