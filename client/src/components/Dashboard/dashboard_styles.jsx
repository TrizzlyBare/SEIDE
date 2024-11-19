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
  margin-top: 40px;
  margin-left: 20px;
  margin-right: 20px;

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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 20px;
  height: 80px;
  overflow: hidden; // Ensure content stays within bounds
  padding: 0;

  &:hover {
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const SubjectName = styled.div`
  padding: 20px;
  cursor: pointer;
  flex: 0 0 auto;
  min-width: 200px;
`;

export const SubcategoryList = styled.div`
  margin-left: 20px;
`;

export const Subcategory = styled.div`
  margin-bottom: 8px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  height: 300px;

  &:hover {
    background-color: #efefef;
  }
`;

export const ViewTopicsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: right;
  flex: 1;
  height: 100%;
  border: none;
  background-color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0 20px;
  margin: 0;
`;
