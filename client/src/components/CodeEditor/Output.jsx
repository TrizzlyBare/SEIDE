import React, { useState } from "react";
import { executeCode } from "../../middleware/Editorapi";
import RunButton from "./RunButton";
import styled from "styled-components";

const OutputContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
`;

const OutputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
`;

const OutputContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  white-space: pre-wrap;
  line-height: 1.5;
`;

const ErrorText = styled.div`
  color: #f48771;
`;

const SuccessText = styled.div`
  color: #89d185;
`;

const Output = ({ editorRef, language, testCase }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
      
      if (testCase) {
        const outputStr = result.output.trim();
        const expectedStr = testCase.expected_output.trim();
        setIsError(outputStr !== expectedStr);
      }
    } catch (error) {
      console.error(error);
      setOutput([error.message || "Unable to run code"]);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OutputContainer>
      <OutputHeader>
        <div>Output</div>
        <RunButton runCode={runCode} isLoading={isLoading} />
      </OutputHeader>
      <OutputContent>
        {output && output.map((line, index) => (
          isError ? (
            <ErrorText key={index}>{line}</ErrorText>
          ) : (
            <SuccessText key={index}>{line}</SuccessText>
          )
        ))}
        {testCase && output && (
          <div style={{ marginTop: '16px', borderTop: '1px solid #404040', paddingTop: '16px' }}>
            <div>Test Case Result:</div>
            <div style={{ color: isError ? '#f48771' : '#89d185' }}>
              {isError ? 'Failed' : 'Passed'}
            </div>
          </div>
        )}
      </OutputContent>
    </OutputContainer>
  );
};

export default Output;