import React from 'react';
import styled from 'styled-components';

const TypeSelection = styled.div`
  display: flex;
  gap: 20px;
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  
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

const QuestionTypeSelector = ({ selectedType, onChange }) => (
  <TypeSelection>
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
  </TypeSelection>
);

export default QuestionTypeSelector;