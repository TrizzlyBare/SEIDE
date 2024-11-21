import styled, { keyframes, css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Header = styled.div`
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

export const DashboardContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

export const SubjectList = styled.div`
  margin: 20px 0;
`;

export const Subject = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 20px;
  height: 80px;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const SubjectTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background-color: #f8f8f8;
  }
`;

export const ViewTopicsButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 30px;
  border: none;
  cursor: pointer;
  background-color: #fff;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
  width: 100%;
  min-width: 200px;
`;

export const SubcategoryList = styled.div`
  margin-left: 20px;
`;

export const Subcategory = styled.div`
  margin-bottom: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  height: 300px;
`;

export const Card = styled.div`
  width: auto;
  height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  margin: 20px;
  flex-direction: row;
`;

export const CardImageContainer = styled.div`
  flex: 7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

export const CardTextContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ChangingText = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin-top: 10px;
  color: #555;
  ${({ show }) =>
    show &&
    css`
      animation: ${fadeIn} 0.5s ease-in-out;
    `}
`;

export const InfoContainer = styled.div`
  padding: 20px;
  margin: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
`;

export const LecturersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Column = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;

  &:first-child {
    margin-right: 20px;
  }
`;
