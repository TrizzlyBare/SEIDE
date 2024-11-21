import React from "react";
import {
  FooterContainer,
  FooterText,
  FooterLinks,
  FooterLink,
  KmitlLogoImg,
} from "./FooterStyle";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLinks>
        <FooterLink href="/home">
          <KmitlLogoImg src="/images/kmitlLogo.png" alt="KmitlLogo" />
        </FooterLink>
        <FooterLink href="/contact">Contact</FooterLink>
      </FooterLinks>
      <FooterText>
        &copy; 2024 Software Engineering, King Mongkut's Institute of Technology
        Ladkrabang
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
