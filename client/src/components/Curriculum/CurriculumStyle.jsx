import styled from "styled-components";

export const CurriculumContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Header = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  background-color: #333;
  color: #fff;
  margin: 40px 20px 0 20px;
  font-size: 24px;
  border-radius: 6px;
`;

export const SubHeader = styled.h2`
  padding: 20px; /* Adjusted padding for better spacing */
  margin: 20px; /* Consistent top and bottom margin */
  font-size: 1.5rem; /* Increased font size for better readability */
  background-color: #f0f0f0; /* Slightly lighter background color */
  border-radius: 10px; /* Increased border radius for smoother corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Enhanced box shadow for better depth */
  color: #333; /* Text color */
  font-weight: bold; /* Bold text for emphasis */
  text-transform: uppercase; /* Uppercase text for a more formal look */
`;

export const Paragraph = styled.p`
  padding: 20px;
  margin: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
`;

export const ImageWrapper = styled.div`
  text-align: center; /* Centers the image inside this wrapper */
  margin-bottom: 20px; /* Keeps consistent spacing */
`;

export const Image = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
`;
export const CourseContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

export const SemesterContainer = styled.div`
  background-color: #fff;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 10px;
`;

export const CourseTitle = styled.h4`
  color: #3f72af;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const CourseDetails = styled.p`
  font-size: 1rem;
  margin-bottom: 10px;
`;

export const DescriptionButton = styled.button`
  background-color: #3f72af;
  color: #fff;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #112d4e;
  }
`;
