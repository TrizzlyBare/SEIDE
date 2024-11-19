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
  margin-bottom: 10px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 20px;
  r &:hover {
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
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
