import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 8px 16px;
  background: #34a853;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-left: 8px;
  transition: background 0.2s;
  &:hover {
    background: #2d8644;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SubmitButton = ({ onSubmit, isSubmitting }) => {
  return (
    <StyledButton onClick={onSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </StyledButton>
  );
};

export default SubmitButton;
