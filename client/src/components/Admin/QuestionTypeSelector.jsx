import React from 'react';
import styled from 'styled-components';

const TypeSelection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  width: 100%;
`;

const SelectionGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  
  label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  input[type="radio"] {
    cursor: pointer;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: #1557b0;
  }
`;

const DateSelectionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  width: 100%;

  input[type="datetime-local"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    flex: 1;
  }

  .date-label {
    font-weight: 500;
    min-width: 80px;
  }

  .date-display {
    padding: 8px;
    background: #e3f2fd;
    border-radius: 4px;
    color: #1565c0;
    margin-left: 10px;
  }
`;

const QuestionTypeSelector = ({ selectedType, onChange, dueDate, onDueDateChange }) => {
  return (
    <div>
      <TypeSelection>
        <SelectionGroup>
          <label>
            <input
              type="radio"
              value="homework"
              name="questionType"
              checked={selectedType === "homework"}
              onChange={e => onChange(e.target.value)}
            />
            Homework
          </label>
          <label>
            <input
              type="radio"
              value="lab"
              name="questionType"
              checked={selectedType === "lab"}
              onChange={e => onChange(e.target.value)}
            />
            Lab
          </label>
        </SelectionGroup>
      </TypeSelection>
    </div>
  );
};

export default QuestionTypeSelector;