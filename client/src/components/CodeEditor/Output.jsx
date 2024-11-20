import React, { useState } from "react";
import { executeCode } from "../../middleware/Editorapi";
import { useParams } from "react-router-dom";
import RunButton from "./RunButton";
import styled from "styled-components";

const OutputWrapper = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
`;

const OutputContainer = styled.div`
  font-family: monospace;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
  transition: all 0.3s ease;

  &.error {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ef9a9a;
  }

  &.success {
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }
`;

const TestCaseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #666;
`;

const MismatchBanner = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-weight: 500;
  border: 1px solid #ef9a9a;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "⚠️";
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #388e3c;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ComparisonContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: ${props => props.$mismatch ? '#ffebee' : '#e8f5e9'};
  border-radius: 4px;
  border: 1px solid ${props => props.$mismatch ? '#ef9a9a' : '#a5d6a7'};
`;

const Output = ({ editorRef, language, testCase }) => {
  const { question_id } = useParams();
  const [output, setOutput] = useState(null);
  const [actualOutput, setActualOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(true); // Initialize as true
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const compareOutputs = (actual, expected) => {
    // If either output is missing, it's an error
    if (!actual || !expected) {
      console.log('Missing output - setting error', { actual, expected });
      return false;
    }

    // Convert to strings and clean up
    const actualStr = String(actual).replace(/\n$/, '');
    const expectedStr = String(expected).replace(/\n$/, '');

    console.log('Comparing outputs:', {
      actual: actualStr,
      expected: expectedStr,
      actualLength: actualStr.length,
      expectedLength: expectedStr.length,
      isMatch: actualStr === expectedStr
    });

    // Exact match required
    return actualStr === expectedStr;
  };

  const handleSaveAndComplete = async () => {
    if (!editorRef.current || !question_id) return;
    
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode?.trim()) return;
    
    try {
      setIsSaving(true);
      
      const response = await fetch(`http://localhost:8000/questions/${question_id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: sourceCode,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      setOutput(prev => [
        ...(prev || []),
        '✓ Solution saved and marked as complete!'
      ]);
      
    } catch (error) {
      console.error("Error saving code:", error);
      setOutput(prev => [
        ...(prev || []),
        `✗ Failed to save: ${error.message}`
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const runCode = async () => {
    if (!editorRef.current) {
      setOutput(["Editor not initialized"]);
      setIsError(true);
      setIsSuccess(false);
      return;
    }

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode?.trim()) {
      setOutput(["No code to run"]);
      setIsError(true);
      setIsSuccess(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(true); // Default to error state
      setActualOutput(null);
      
      const { run: result } = await executeCode(language, sourceCode);
      
      if (result.stderr) {
        setOutput([result.stderr]);
        setIsError(true);
        setIsSuccess(false);
        return;
      }

      // Clean up the output
      const cleanOutput = result.output.replace(/\n$/, '');
      setOutput(cleanOutput ? cleanOutput.split('\n') : []);
      setActualOutput(cleanOutput || '');

      if (testCase) {
        const matches = compareOutputs(cleanOutput, testCase.expected_output);
        console.log('Test case validation:', {
          actual: cleanOutput,
          expected: testCase.expected_output,
          matches: matches
        });
        
        setIsError(!matches);
        setIsSuccess(matches);
      } else {
        setIsError(true);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setOutput([
        `Error executing code:`,
        error.message || "An unexpected error occurred",
        'Please check your code and try again.'
      ]);
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OutputWrapper>
      {testCase && (
        <TestCaseInfo>
          <div>
            <strong>Test Input: </strong>
            {testCase.input_data}
          </div>
          <div>
            <strong>Expected Output: </strong>
            <pre style={{ 
              display: 'inline-block',
              margin: '0',
              padding: '2px 6px',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              "{testCase.expected_output}"
            </pre>
          </div>
        </TestCaseInfo>
      )}

      {isError && testCase && (
        <MismatchBanner>
          Output does not match the expected result
          <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
            Check for exact match including spaces and line breaks
          </div>
        </MismatchBanner>
      )}

      <OutputContainer className={isError ? "error" : isSuccess ? "success" : ""}>
        <strong>Program Output:</strong>
        {output ? (
          output.map((line, index) => (
            <div key={index}>
              <pre style={{ margin: 0, display: 'inline' }}>
                {line.length === 0 ? '(empty line)' : `"${line}"`}
              </pre>
            </div>
          ))
        ) : (
          <div>Run your code to see the output...</div>
        )}
      </OutputContainer>

      {actualOutput !== null && testCase && (
        <ComparisonContainer $mismatch={isError}>
          <div>
            <strong>Expected Output:</strong> 
            <pre style={{ 
              display: 'inline-block',
              margin: '0 0 0 8px',
              padding: '2px 6px',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              {[...testCase.expected_output].map(char => 
                char === ' ' ? '␣' : char === '\n' ? '⏎\n' : char
              ).join('')}
            </pre>
          </div>
          <div>
            <strong>Your Output:</strong> 
            <pre style={{ 
              display: 'inline-block',
              margin: '0 0 0 8px',
              padding: '2px 6px',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              {actualOutput ? [...actualOutput].map(char => 
                char === ' ' ? '␣' : char === '\n' ? '⏎\n' : char
              ).join('') : '(no output)'}
            </pre>
          </div>
          <div style={{ marginTop: '8px', color: isError ? '#c62828' : '#2e7d32' }}>
            {isError ? (
              <>
                ✗ Outputs do not match exactly
                <div style={{ fontSize: '0.9em', marginTop: '4px', color: '#666' }}>
                  Expected length: {testCase.expected_output.length}, 
                  Got length: {(actualOutput || '').length}
                </div>
              </>
            ) : (
              '✓ Outputs match exactly'
            )}
          </div>
        </ComparisonContainer>
      )}

      <ButtonGroup>
        <SaveButton 
          onClick={handleSaveAndComplete} 
          disabled={isSaving || isLoading || isError || !isSuccess}
        >
          {isSaving ? "Saving..." : "Save & Complete"}
        </SaveButton>
        <RunButton runCode={runCode} isLoading={isLoading} />
      </ButtonGroup>
    </OutputWrapper>
  );
};

export default Output;