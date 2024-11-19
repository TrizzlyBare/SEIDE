import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 8px 16px;
  background: ${(props) => (props.$primary ? "#1a73e8" : "#666")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.$primary ? "#1557b0" : "#555")};
  }
  &:disabled {
    background: #999;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: ${(props) => (props.$large ? "100px" : "60px")};
  font-family: ${(props) => (props.$monospace ? "monospace" : "inherit")};
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subject_id, topic_id } = useParams();
  const navigate = useNavigate();

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    answers: [{ text: "", isCorrect: false }],
    testCases: [
      {
        input: "",
        expectedOutput: "",
        setupScript: "#!/bin/bash\n\n",
        validationScript: 'diff <(echo "$expected") <(echo "$output")',
      },
    ],
  });

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/questions/`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      const topicQuestions = data.filter(
        (q) => q.topic_id === parseInt(topic_id)
      );
      setQuestions(topicQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topic_id]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const questionResponse = await fetch(`http://localhost:8000/questions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: newQuestion.questionText,
          topic_id: parseInt(topic_id),
        }),
      });

      if (!questionResponse.ok) throw new Error("Failed to create question");
      const questionData = await questionResponse.json();

      for (const answer of newQuestion.answers) {
        await fetch(
          `http://localhost:8000/questions/${questionData.question_id}/answers/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answer_text: answer.text,
              is_correct: answer.isCorrect,
            }),
          }
        );
      }

      for (const testCase of newQuestion.testCases) {
        await fetch(
          `http://localhost:8000/questions/${questionData.question_id}/testcases/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input_data: testCase.input,
              expected_output: testCase.expectedOutput,
              setup_script: testCase.setupScript,
              validation_script: testCase.validationScript,
            }),
          }
        );
      }

      setIsModalOpen(false);
      resetForm();
      fetchQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewQuestion({
      questionText: "",
      answers: [{ text: "", isCorrect: false }],
      testCases: [
        {
          input: "",
          expectedOutput: "",
          setupScript: "#!/bin/bash\n\n",
          validationScript: 'diff <(echo "$expected") <(echo "$output")',
        },
      ],
    });
  };

  const addTestCase = () => {
    setNewQuestion({
      ...newQuestion,
      testCases: [
        ...newQuestion.testCases,
        {
          input: "",
          expectedOutput: "",
          setupScript: "#!/bin/bash\n\n",
          validationScript: 'diff <(echo "$expected") <(echo "$output")',
        },
      ],
    });
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button onClick={() => navigate(`/admin/${subject_id}/create`)}>
          ← Back to Topics
        </Button>
        <h1 style={{ margin: 0, fontSize: "24px" }}>Questions</h1>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <Button
        $primary
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: "20px" }}
      >
        Add New Question
      </Button>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        questions.map((question) => (
          <Card key={question.question_id}>
            <h3 style={{ margin: "0 0 16px 0" }}>{question.question_text}</h3>

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginBottom: "8px" }}>Answers:</h4>
              {question.answers?.map((answer, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px",
                    margin: "4px 0",
                    background: answer.is_correct ? "#e8f5e9" : "#fff",
                    border: `1px solid ${
                      answer.is_correct ? "#a5d6a7" : "#e0e0e0"
                    }`,
                    borderRadius: "4px",
                  }}
                >
                  {answer.answer_text}
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ marginBottom: "8px" }}>Test Cases:</h4>
              {question.test_cases?.map((testCase, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px",
                    margin: "8px 0",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  <div>Input: {testCase.input_data}</div>
                  <div>Expected Output: {testCase.expected_output}</div>
                  {testCase.setup_script && (
                    <div style={{ marginTop: "8px" }}>
                      <strong>Setup Script:</strong>
                      <pre
                        style={{
                          background: "#f1f1f1",
                          padding: "8px",
                          marginTop: "4px",
                          borderRadius: "4px",
                        }}
                      >
                        {testCase.setup_script}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))
      )}

      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "20px" }}>Add New Question</h2>
            <form onSubmit={handleAddQuestion}>
              <TextArea
                $large
                placeholder="Question text"
                value={newQuestion.questionText}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    questionText: e.target.value,
                  })
                }
                required
              />

              <h3 style={{ margin: "20px 0 10px" }}>Answers</h3>
              {newQuestion.answers.map((answer, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <Input
                    placeholder="Answer text"
                    value={answer.text}
                    onChange={(e) => {
                      const newAnswers = [...newQuestion.answers];
                      newAnswers[idx].text = e.target.value;
                      setNewQuestion({ ...newQuestion, answers: newAnswers });
                    }}
                    required
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={(e) => {
                        const newAnswers = [...newQuestion.answers];
                        newAnswers[idx].isCorrect = e.target.checked;
                        setNewQuestion({ ...newQuestion, answers: newAnswers });
                      }}
                    />
                    Correct Answer
                  </label>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    answers: [
                      ...newQuestion.answers,
                      { text: "", isCorrect: false },
                    ],
                  })
                }
              >
                Add Answer
              </Button>

              <h3 style={{ margin: "20px 0 10px" }}>Test Cases</h3>
              {newQuestion.testCases.map((testCase, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <Input
                    placeholder="Input"
                    value={testCase.input}
                    onChange={(e) => {
                      const newTestCases = [...newQuestion.testCases];
                      newTestCases[idx].input = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        testCases: newTestCases,
                      });
                    }}
                    required
                  />
                  <Input
                    placeholder="Expected Output"
                    value={testCase.expectedOutput}
                    onChange={(e) => {
                      const newTestCases = [...newQuestion.testCases];
                      newTestCases[idx].expectedOutput = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        testCases: newTestCases,
                      });
                    }}
                    required
                  />
                  <TextArea
                    $monospace
                    placeholder="Setup Script (Bash)"
                    value={testCase.setupScript}
                    onChange={(e) => {
                      const newTestCases = [...newQuestion.testCases];
                      newTestCases[idx].setupScript = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        testCases: newTestCases,
                      });
                    }}
                  />
                  <TextArea
                    $monospace
                    placeholder="Validation Script (Bash)"
                    value={testCase.validationScript}
                    onChange={(e) => {
                      const newTestCases = [...newQuestion.testCases];
                      newTestCases[idx].validationScript = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        testCases: newTestCases,
                      });
                    }}
                  />
                </div>
              ))}
              <Button type="button" onClick={addTestCase}>
                Add Test Case
              </Button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                <Button type="submit" $primary disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Question"}
                </Button>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
}