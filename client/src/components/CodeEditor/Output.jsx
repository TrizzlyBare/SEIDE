import React, { useState, useEffect } from "react";
import { executeCode } from "../../middleware/Editorapi";
import RunButton from "./RunButton";
import SubmitButton from "./SubmitButton";
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const OutputContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-family: "Consolas", "Monaco", monospace;
  white-space: pre-wrap;
  line-height: 1.5;
`;

const ErrorText = styled.div`
  color: #f48771;
`;

const SuccessText = styled.div`
  color: #89d185;
`;

const Output = ({ editorRef, language, testCase, questionId }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/role-check", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      } else if (response.status === 401) {
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error checking role:", error);
      setUserRole(null);
    }
  };

  const isStudent = () => {
    return userRole && ["YEAR1", "YEAR2", "YEAR3", "YEAR4"].includes(userRole);
  };

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

  const handleSubmit = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) {
      setOutput([
        "❌ No code to submit",
        "Please write some code before submitting.",
      ]);
      setIsError(true);
      return;
    }

    if (!isStudent()) {
      setOutput([
        "❌ Access denied",
        "Only students can submit code.",
        "",
        userRole ? "Your role: " + userRole : "Please log in as a student.",
      ]);
      setIsError(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Run the code first
      const { run: result } = await executeCode(language, sourceCode);

      // Submit code
      const response = await fetch(
        `http://localhost:8000/questions/${questionId}/submit-code`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            code: sourceCode,
            language: language,
            output: result.output,
            execution_time: result.executionTime,
            memory_used: result.memoryUsed,
          }),
        }
      );

      if (response.status === 401) {
        throw new Error("Authentication required");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit code");
      }

      const submissionResult = await response.json();

      setOutput([
        `✅ Code ${
          submissionResult.is_correct ? "passed" : "failed"
        } and has been saved!`,
        "",
        "Submission Details:",
        `Status: ${submissionResult.is_correct ? "Passed ✓" : "Failed ✗"}`,
        `Submitted at: ${new Date(
          submissionResult.submitted_at
        ).toLocaleString()}`,
        "",
        submissionResult.is_correct
          ? "Great work! Your solution has been saved."
          : "Keep trying! Your progress has been saved.",
        "",
        testCase &&
          [
            "Test Case Results:",
            `Input: ${testCase.input_data}`,
            `Expected: ${testCase.expected_output}`,
            `Your output: ${result.output.trim()}`,
          ].join("\n"),
      ]);
      setIsError(!submissionResult.is_correct);
    } catch (error) {
      console.error(error);
      setOutput([
        "❌ Submission failed",
        error.message || "Unable to submit code",
        "",
        "Please try again or contact support if the issue persists.",
      ]);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OutputContainer>
      <OutputHeader>
        <div>
          Output
          {userRole && (
            <span
              className="ml-2 text-sm"
              style={{ color: isStudent() ? "#4caf50" : "#ff9800" }}
            >
              ({userRole})
            </span>
          )}
        </div>
        <ButtonGroup>
          <RunButton runCode={runCode} isLoading={isLoading} />
          <SubmitButton
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={!isStudent()}
          />
        </ButtonGroup>
      </OutputHeader>
      <OutputContent>
        {!userRole && (
          <div className="p-4 mb-4 bg-orange-100 border border-orange-200 rounded text-orange-800">
            ⚠️ Please log in to submit code
          </div>
        )}
        {userRole && !isStudent() && (
          <div className="p-4 mb-4 bg-orange-100 border border-orange-200 rounded text-orange-800">
            ⚠️ Only students can submit code. Current role: {userRole}
          </div>
        )}
        {output &&
          output.map((line, index) =>
            isError ? (
              <ErrorText key={index}>{line}</ErrorText>
            ) : (
              <SuccessText key={index}>{line}</SuccessText>
            )
          )}
      </OutputContent>
    </OutputContainer>
  );
};

export default Output;
