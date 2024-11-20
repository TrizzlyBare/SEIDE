import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  background-color: #2d3748;
  color: white;
  padding: 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FooterText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 15px;
`;

export const FooterLink = styled.a`
  color: #fbbf24;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #e2e8f0;
  }
`;
