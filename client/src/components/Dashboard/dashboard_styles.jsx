import styled from "styled-components";

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
