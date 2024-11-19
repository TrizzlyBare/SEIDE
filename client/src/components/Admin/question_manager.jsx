import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #333;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.h3`
  margin: 0 0 16px 0;
  color: #333;
`;

const AnswerList = styled.div`
  margin-top: 16px;
`;

const Answer = styled.div`
  padding: 8px;
  margin: 4px 0;
  background-color: ${props => props.$isCorrect ? '#e8f5e9' : '#fff'};
  border: 1px solid ${props => props.$isCorrect ? '#a5d6a7' : '#e0e0e0'};
  border-radius: 4px;
`;

const TestCaseList = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
`;

const TestCase = styled.div`
  margin: 8px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
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
  min-height: 100px;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 8px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const AddButton = styled(Button)`
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 8px 0;
`;

const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
      questionText: '',
      answers: [{ text: '', isCorrect: false }],
      testCases: [{ input: '', expectedOutput: '' }]
    });
  
    const navigate = useNavigate();
    const { subject_id, topic_id } = useParams();
  
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // Updated endpoint to match backend structure
        const response = await fetch(`http://localhost:8000/questions/`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        // Filter questions for the current topic
        const topicQuestions = data.filter(q => q.topic_id === parseInt(topic_id));
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
  
    const handleBack = () => {
      navigate(`/subjects/${subject_id}/topics`);
    };
  
    const handleAddQuestion = async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        
        // Create question - updated endpoint
        const questionResponse = await fetch(`http://localhost:8000/questions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_text: newQuestion.questionText,
            topic_id: parseInt(topic_id)
          })
        });
  
        if (!questionResponse.ok) throw new Error('Failed to create question');
        const questionData = await questionResponse.json();
  
        // Add answers - endpoint matches questions.py
        for (const answer of newQuestion.answers) {
          await fetch(`http://localhost:8000/questions/${questionData.question_id}/answers/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              answer_text: answer.text,
              is_correct: answer.isCorrect,
              question_id: questionData.question_id
            })
          });
        }
  
        // Add test cases - endpoint matches questions.py
        for (const testCase of newQuestion.testCases) {
            await fetch(`http://localhost:8000/questions/${questionData.question_id}/testcases/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                input_data: testCase.input,        // Changed from input
                expected_output: testCase.expectedOutput,  // Changed from expectedOutput
              })
            });
          }
  
        setIsModalOpen(false);
        setNewQuestion({
          questionText: '',
          answers: [{ text: '', isCorrect: false }],
          testCases: [{ input: '', expectedOutput: '' }]
        });
        fetchQuestions();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    const addAnswer = () => {
      setNewQuestion({
        ...newQuestion,
        answers: [...newQuestion.answers, { text: '', isCorrect: false }]
      });
    };
  
    const addTestCase = () => {
      setNewQuestion({
        ...newQuestion,
        testCases: [...newQuestion.testCases, { input: '', expectedOutput: '' }]
      });
    };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>← Back to Topics</BackButton>
        <Title>Questions</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AddButton onClick={() => setIsModalOpen(true)}>Add New Question</AddButton>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        questions.map(question => (
          <QuestionCard key={question.question_id}>
            <QuestionText>{question.question_text}</QuestionText>
            
            <AnswerList>
              <h4>Answers:</h4>
              {question.answers?.map((answer, index) => (
                <Answer key={index} $isCorrect={answer.is_correct}>
                  {answer.answer_text}
                </Answer>
              ))}
            </AnswerList>

            <TestCaseList>
              <h4>Test Cases:</h4>
              {question.test_cases?.map((testCase, index) => (
                <TestCase key={index}>
                  <div>Input: {testCase.input_data}</div>
                  <div>Expected Output: {testCase.expected_output}</div>
                </TestCase>
              ))}
            </TestCaseList>
          </QuestionCard>
        ))
      )}

      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <h2>Add New Question</h2>
            <form onSubmit={handleAddQuestion}>
              <TextArea
                placeholder="Question text"
                value={newQuestion.questionText}
                onChange={e => setNewQuestion({...newQuestion, questionText: e.target.value})}
                required
              />

              <h3>Answers</h3>
              {newQuestion.answers.map((answer, index) => (
                <div key={index}>
                  <Input
                    placeholder="Answer text"
                    value={answer.text}
                    onChange={e => {
                      const newAnswers = [...newQuestion.answers];
                      newAnswers[index].text = e.target.value;
                      setNewQuestion({...newQuestion, answers: newAnswers});
                    }}
                    required
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={e => {
                        const newAnswers = [...newQuestion.answers];
                        newAnswers[index].isCorrect = e.target.checked;
                        setNewQuestion({...newQuestion, answers: newAnswers});
                      }}
                    />
                    Correct Answer
                  </label>
                </div>
              ))}
              <Button type="button" onClick={addAnswer}>Add Another Answer</Button>

              <h3>Test Cases</h3>
              {newQuestion.testCases.map((testCase, index) => (
                <div key={index}>
                  <Input
                    placeholder="Input"
                    value={testCase.input}
                    onChange={e => {
                      const newTestCases = [...newQuestion.testCases];
                      newTestCases[index].input = e.target.value;
                      setNewQuestion({...newQuestion, testCases: newTestCases});
                    }}
                    required
                  />
                  <Input
                    placeholder="Expected Output"
                    value={testCase.expectedOutput}
                    onChange={e => {
                      const newTestCases = [...newQuestion.testCases];
                      newTestCases[index].expectedOutput = e.target.value;
                      setNewQuestion({...newQuestion, testCases: newTestCases});
                    }}
                    required
                  />
                </div>
              ))}
              <Button type="button" onClick={addTestCase}>Add Another Test Case</Button>

              <div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Question'}
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
};

export default QuestionManager;