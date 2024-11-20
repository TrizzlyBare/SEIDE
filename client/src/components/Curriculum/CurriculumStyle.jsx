import styled from "styled-components";

export const CurriculumContainer = styled.div`
  padding: 10px 20px; /* 10px for top and bottom, 20px for left and right */
  background-color:#dbe3ef;
`;

export const Header = styled.h1`
  font-size: 4rem;
  margin-bottom: 20px;
  text-align:center;
  color:#3f72af
`;

export const SubHeader = styled.h2`
  color:#112d4e;
  font-size: 2.0rem;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const Paragraph = styled.p`
  color:black;
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 20px;
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
`;

export const SemesterContainer = styled.div`
  background-color: #fff;
  flex: 1;
  border: 1px solid #ccc;
  border-radius:20px;
  padding: 10px;
`;

export const CourseTitle = styled.h4`
  color: #3f72af ;
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
