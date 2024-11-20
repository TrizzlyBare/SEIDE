import styled from "styled-components";

export const CurriculumContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

export const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

export const SubHeader = styled.h2`
  font-size: 1.5rem;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
`;

export const Image = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  margin-bottom: 20px;
`;

export const CourseContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const SemesterContainer = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
`;

export const CourseTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const CourseDetails = styled.p`
  font-size: 1rem;
  margin-bottom: 10px;
`;

export const DescriptionButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
