import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import "../../styles/CodeEditorPage.css";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "../../middleware/constants";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: #f4f4f4;
`;

const QuestionPanel = styled.div`
  width: 40%;
  min-width: 400px;
  max-width: 600px;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border-right: 1px solid #e0e0e0;
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
`;

const TestCase = styled.div`
  background: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.$type === 'language' ? '#e3f2fd' : '#f3e5f5'};
  color: ${props => props.$type === 'language' ? '#1565c0' : '#7b1fa2'};
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

const QuestionCodeEditor = () => {
  const { subject_id, topic_id, question_id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [question, setQuestion] = useState(null);
  const [value, setValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/subjects/${subject_id}/topics/${topic_id}/questions/${question_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        
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
          <BackButton onClick={() => navigate(`/dashboard/${subject_id}/${topic_id}`)}>
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
          <BackButton onClick={() => navigate(`/dashboard/${subject_id}/${topic_id}`)}>
            Back to Questions
          </BackButton>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <QuestionPanel>
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BackButton onClick={() => navigate(`/dashboard/${subject_id}/${topic_id}`)}>
            ← Back
          </BackButton>
          <div>
            <Tag 
              $type="language" 
              $version={LANGUAGE_VERSIONS[question.language]}
              style={{ marginRight: "8px" }}
            >
              {question.language}
            </Tag>
            <Tag $type="type">{question.question_type || 'practice'}</Tag>
          </div>
        </div>

        <h2 style={{ marginBottom: "20px" }}>{question.question_text}</h2>
        
        {question.test_cases && question.test_cases.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "12px" }}>Test Cases</h3>
            {question.test_cases.map((testCase, idx) => (
              <TestCase key={idx}>
                <div><strong>Input:</strong> {testCase.input_data}</div>
                <div><strong>Expected Output:</strong> {testCase.expected_output}</div>
              </TestCase>
            ))}
          </div>
        )}

        {question.answers && question.answers.length > 0 && (
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

      <EditorPanel>
        <EditorHeader>
          <LanguageSelector 
            language={selectedLanguage}
            onSelect={handleLanguageChange}
            disabled={false} // Now enabled for language switching
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>
              Version: {LANGUAGE_VERSIONS[selectedLanguage]}
            </span>
          </div>
        </EditorHeader>
        
        <EditorContainer>
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
        </EditorContainer>
        
        <Output 
          editorRef={editorRef} 
          language={selectedLanguage}
          testCases={question?.test_cases}
        />
      </EditorPanel>
    </Container>
  );
};

export default QuestionCodeEditor;
