import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #1557b0;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RunButton = ({ runCode, isLoading }) => {
  return (
    <StyledButton onClick={runCode} disabled={isLoading}>
      {isLoading ? "Running..." : "Run Code"}
    </StyledButton>
  );
};

export default RunButton;
