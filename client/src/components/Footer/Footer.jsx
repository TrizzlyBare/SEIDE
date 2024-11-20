import React from "react";
import {
  FooterContainer,
  FooterText,
  FooterLinks,
  FooterLink,
} from "./FooterStyle";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>&copy; 2023 Your Company. All rights reserved.</FooterText>
      <FooterLinks>
        <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
        <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
        <FooterLink href="/contact">Contact</FooterLink>
      </FooterLinks>
    </FooterContainer>
  );
};

export default Footer;
