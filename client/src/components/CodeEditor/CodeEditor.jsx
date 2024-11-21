import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "../../middleware/constants";
import "../../styles/CodeEditorPage.css";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: #f4f4f4;
`;

const LeftPanel = styled.div`
  width: 40%;
  min-width: 400px;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-right: 1px solid #e0e0e0;
`;

const QuestionPanel = styled.div`
  height: 60%;
  overflow-y: auto;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const TestCasePanel = styled.div`
  height: 40%;
  overflow-y: auto;
  padding: 20px;
`;

const EditorPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
`;

const TestCase = styled.div`
  background: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }

  &.selected {
    border-color: #1565c0;
    background: #e3f2fd;
  }
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.$type === 'language' ? '#e3f2fd' : '#f3e5f5'};
  color: ${props => props.$type === 'language' ? '#1565c0' : '#7b1fa2'};
  
  &:after {
    content: ${props => props.$version ? `" (${props.$version})"` : ''};
    font-size: 0.75rem;
    opacity: 0.7;
  }
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const EditorWrapper = styled.div`
  flex: 2;
  min-height: 0;
`;

const OutputWrapper = styled.div`
  flex: 1;
  min-height: 200px;
  border-top: 1px solid #e0e0e0;
`;

const QuestionCodeEditor = () => {
  const { subject_id, topic_id, question_id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [question, setQuestion] = useState(null);
  const [value, setValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/questions/${question_id}` // Updated endpoint
        );
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        console.log("Question Data:", data);
        
        // Set default language to python if not specified
        const questionLanguage = data.language || 'python';
        
        // Validate language support
        const validLanguage = LANGUAGE_VERSIONS[questionLanguage] ? questionLanguage : 'python';
        setSelectedLanguage(validLanguage);
        
        setQuestion({
          ...data,
          language: validLanguage
        });
        setValue(getInitialCode(validLanguage, data.question_text));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching question:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [subject_id, topic_id, question_id]);

  const getInitialCode = (language, questionText) => {
    if (!LANGUAGE_VERSIONS[language]) {
      console.warn(`Language ${language} is not supported, falling back to Python`);
      language = 'python';
    }

    // Use CODE_SNIPPETS as base template
    let template = CODE_SNIPPETS[language] || '';

    // Add question text as comment based on language
    const commentPrefix = language === 'python' ? '# ' : '// ';
    const commentedQuestion = `${commentPrefix}${questionText}\n\n`;

    // Add solution structure based on language
    const solutionTemplates = {
      javascript: `function solution() {\n  // Your code here\n}\n\n// Test your solution\nsolution();`,
      python: `def solution():\n    # Your code here\n    pass\n\n# Test your solution\nif __name__ == '__main__':\n    solution()`,
      java: `public class Solution {\n    public static void main(String[] args) {\n        solution();\n    }\n\n    public static void solution() {\n        // Your code here\n    }\n}`,
      cpp: `#include <iostream>\n\nvoid solution() {\n    // Your code here\n}\n\nint main() {\n    solution();\n    return 0;\n}`
    };

    // Combine everything
    return commentedQuestion + (solutionTemplates[language] || template);
  };

  const handleLanguageChange = (newLanguage) => {
    if (LANGUAGE_VERSIONS[newLanguage]) {
      setSelectedLanguage(newLanguage);
      setValue(getInitialCode(newLanguage, question.question_text));
    }
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ padding: "20px" }}>Loading question details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ padding: "20px" }}>
          <h3>Error</h3>
          <p>{error}</p>
          <BackButton onClick={() => navigate(`/subjects/${subject_id}/topics/${topic_id}/questions`)}>
            Back to Questions
          </BackButton>
        </div>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container>
        <div style={{ padding: "20px" }}>
          <h3>Question not found</h3>
          <BackButton onClick={() => navigate(`/subjects/${subject_id}/topics/${topic_id}/questions`)}>
            Back to Questions
          </BackButton>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <LeftPanel>
        <QuestionPanel>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BackButton onClick={() => navigate(`/subjects/${subject_id}/topics/${topic_id}/questions`)}>
              ← Back
            </BackButton>
            <div>
              <Tag 
                $type="language" 
                $version={LANGUAGE_VERSIONS[selectedLanguage]}
                style={{ marginRight: "8px" }}
              >
                {selectedLanguage}
              </Tag>
              <Tag $type="type">{question?.question_type || 'practice'}</Tag>
            </div>
          </div>

          <h2 style={{ marginBottom: "20px" }}>{question?.question_text}</h2>
          
          {question?.answers && question.answers.length > 0 && (
            <div>
              <h3 style={{ marginBottom: "12px" }}>Example Solutions</h3>
              {question.answers.map((answer, idx) => (
                <div key={idx} style={{ 
                  padding: "12px",
                  margin: "8px 0",
                  background: answer.is_correct ? "#e8f5e9" : "#fff",
                  border: `1px solid ${answer.is_correct ? "#a5d6a7" : "#e0e0e0"}`,
                  borderRadius: "4px"
                }}>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {answer.answer_text}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </QuestionPanel>

        <TestCasePanel>
          <h3 style={{ margin: "0 0 12px 0" }}>Test Cases</h3>
          {console.log("Current question test cases:", question?.test_cases)} {/* Add this log */}
          {!question?.test_cases && <div>No test cases available</div>}
          {question?.test_cases?.length === 0 && <div>Test cases array is empty</div>}
          {question?.test_cases && question.test_cases.map((testCase, idx) => (
            <TestCase 
              key={idx}
              className={selectedTestCase === idx ? 'selected' : ''}
              onClick={() => setSelectedTestCase(idx)}
            >
              <div><strong>Input:</strong> {testCase.input_data}</div>
              <div><strong>Expected Output:</strong> {testCase.expected_output}</div>
            </TestCase>
          ))}
        </TestCasePanel>
      </LeftPanel>

      <EditorPanel>
        <EditorHeader>
          <LanguageSelector 
            language={selectedLanguage}
            onSelect={handleLanguageChange}
            disabled={false}
          />
        </EditorHeader>
        
        <EditorContainer>
          <EditorWrapper>
            <Editor
              height="100%"
              language={selectedLanguage}
              value={value}
              onChange={setValue}
              onMount={onMount}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                lineNumbers: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                folding: true,
                bracketPairColorization: true,
              }}
            />
          </EditorWrapper>
          
          <OutputWrapper>
            <Output 
              editorRef={editorRef} 
              language={selectedLanguage}
              testCase={selectedTestCase !== null ? question?.test_cases[selectedTestCase] : null}
              questionId={question_id}
            />
          </OutputWrapper>
        </EditorContainer>
      </EditorPanel>
    </Container>
  );
};

export default QuestionCodeEditor;