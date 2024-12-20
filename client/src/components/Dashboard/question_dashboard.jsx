import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Calendar, Code } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const QuestionItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8f8f8;
  }
`;

const QuestionTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

const LoadingContainer = styled.div`
  padding: 2rem;
`;

const LoadingPlaceholder = styled.div`
  height: 1rem;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  background: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #d32f2f;
`;

const QuestionDashboard = () => {
  const [questions, setQuestions] = useState({ labs: [], homework: [] });
  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { subject_id, topic_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!subject_id || !topic_id) {
          throw new Error("Missing subject or topic ID");
        }

        const subjectIdNum = parseInt(subject_id);
        const topicIdNum = parseInt(topic_id);

        if (isNaN(subjectIdNum) || isNaN(topicIdNum)) {
          throw new Error("Invalid subject or topic ID");
        }

        const subjectRes = await fetch(
          `${API_BASE_URL}/subjects/${subjectIdNum}`
        );
        if (!subjectRes.ok) {
          throw new Error(`Failed to fetch subject (${subjectRes.status})`);
        }
        const subjectData = await subjectRes.json();
        setSubjectName(subjectData.subject_name);

        const topicRes = await fetch(
          `${API_BASE_URL}/subjects/${subjectIdNum}/topics/${topicIdNum}`
        );
        if (!topicRes.ok) {
          throw new Error(`Failed to fetch topic (${topicRes.status})`);
        }
        const topicData = await topicRes.json();
        setTopicName(topicData.topic_name);

        const questionsRes = await fetch(
          `${API_BASE_URL}/subjects/${subjectIdNum}/topics/${topicIdNum}/questions`
        );
        if (!questionsRes.ok) {
          throw new Error(`Failed to fetch questions (${questionsRes.status})`);
        }
        const questionsData = await questionsRes.json();

        if (!Array.isArray(questionsData)) {
          throw new Error("Invalid questions data format");
        }

        const processedQuestions = questionsData.map((q) => ({
          question_id: q.question_id,
          title: q.question_text,
          type: q.question_type,
          language: q.language,
          due_date: q.due_date,
        }));

        setQuestions({
          labs: processedQuestions.filter((q) => q.type === "lab"),
          homework: processedQuestions.filter((q) => q.type === "homework"),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subject_id, topic_id]);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LoadingState = () => (
    <LoadingContainer>
      <LoadingPlaceholder style={{ width: "60%" }} />
      <LoadingPlaceholder style={{ width: "80%" }} />
      <LoadingPlaceholder style={{ width: "40%" }} />
    </LoadingContainer>
  );

  const ErrorState = () => (
    <ErrorContainer>
      <h3>Error Loading Questions</h3>
      <p>{error}</p>
      <BackButton onClick={() => navigate(`/subjects/${subject_id}/topics`)}>
        Back to Topics
      </BackButton>
    </ErrorContainer>
  );

  const QuestionCard = ({ title, questions = [] }) => (
    <Card>
      <CardTitle>{title}</CardTitle>
      <QuestionList>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionItem
              key={question.question_id}
              onClick={() =>
                navigate(
                  `/editor/${subject_id}/${topic_id}/${question.question_id}`
                )
              }
            >
              <QuestionTitle>{question.title}</QuestionTitle>
              <QuestionMeta>
                <MetaItem>
                  <Code size={16} />
                  {question.language || "No language specified"}
                </MetaItem>
                <MetaItem>
                  <Calendar size={16} />
                  {formatDate(question.due_date)}
                </MetaItem>
              </QuestionMeta>
            </QuestionItem>
          ))
        ) : (
          <QuestionItem>No questions available</QuestionItem>
        )}
      </QuestionList>
    </Card>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <DashboardContainer>
      <Header>
        <Title>
          Problems of {topicName}, {subjectName}
        </Title>
        <BackButton onClick={() => navigate(`/subjects/${subject_id}/topics`)}>
          Back to Topics
        </BackButton>
      </Header>

      <ContentSection>
        <QuestionCard title="Lab Questions" questions={questions.labs} />
        <QuestionCard
          title="Homework Questions"
          questions={questions.homework}
        />
      </ContentSection>
    </DashboardContainer>
  );
};

export default QuestionDashboard;
