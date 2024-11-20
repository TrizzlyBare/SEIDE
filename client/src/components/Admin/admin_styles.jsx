import styled from "styled-components";


export const AdminContainer = styled.div`
  width: 100%;
  min-height: 100vh;


  background-color: #dbe2ef;
  
  
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
font-family: 'Montserrat', sans-serif;


`;

export const Title = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  background-color: #333;
  color: #fff;
  margin: 40px 20px 0 20px;
  font-size: 24px;
  border-radius: 6px;
  width:90%;
`;


export const YearTitle = styled.h2`
  font-size: 30px;
  color: #333;
  margin-top: 30px;  /* Adds more space above each year */
  margin-bottom: 20px;  /* Adds space below each year */
  margin-left: 30px;
  text-align: left;
`;

export const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Increased minimum size */
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px; /* Optional: Adjust the container width */
`;


export const SubjectBox = styled.div`
  width: 100%; /* Fills the available grid column width */
  max-width: none; /* Remove max-width constraint */
  height: 120px; /* Slightly increased height */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  font-size: 24px;
  color: #333;
  background: white;
  transition: all 0.2s ease;
  position: relative;
  word-wrap: break-word; /* Wraps text if it’s too long */
  overflow: hidden; /* Hides any overflow */
  text-align: center; /* Ensures text is centered */
  padding: 20px; /* Adjust padding for balance */
  margin-left: 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 3px solid #333;
    font-weight: bold; /* Corrected the typo */
  }

  &:focus {
    outline: 2px solid #007BFF; /* Add focus state for accessibility */
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    margin-left: 10px; /* Adjust for smaller screens */
    padding: 10px; /* Reduce padding on smaller screens */
    font-size: 18px; /* Adjust font size for better readability */
  }
`;


export const Divider = styled.div`
  width: 100%; /* Matches the container width */
  height: 1px; /* Thin line */
  background-color: white; /* Neutral color */
  margin: 20px 0; /* Space between year sections */
  align-self: stretch; /* Ensures it spans its container if needed */
`;



export const SubjectAddingBox = styled(SubjectBox)`
  margin-bottom: 100px;
  margin-top: 20px; /* Add extra top margin */
  padding: 10px;
  aspect-ratio: 0;
  color: white;
  width: 15%;
  height: 60px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #112d4e;
  border-radius: 50px;
  align-self: center;

  &:hover {
    border-color: #999;
    background-color: #3f72af;
  }
`;


export const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff5555;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;f
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 20px;

  ${SubjectBox}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #ff0000;
    color:black;
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