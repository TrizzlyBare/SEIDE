import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 20px;
  bottom: 0;
  left: 0;
  z-index: 1000;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: #333;
  color: white;
  margin-top: auto;
`;

export const FooterText = styled.p`
  margin: 0;
  font-size: 1rem;
  justify-self: center;
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
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

export const KmitlLogoImg = styled.img`
  width: 100px;
  height: auto;
`;
