import styled from "styled-components";

export const AdminContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #333;
`;

export const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
`;

export const SubjectBox = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  background: white;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  ${SubjectBox}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #ff0000;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #333;
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #555;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const YearSelection = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;

  label {
    cursor: pointer;
  }

  input[type="radio"] {
    margin-right: 5px;
  }
`;
