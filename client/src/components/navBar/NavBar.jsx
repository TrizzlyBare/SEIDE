import React from "react";
import {
  HeaderContainer,
  NavLinks,
  BaseLink,
  ProfileLink,
  LogoImage,
} from "./NavBarStyle";

const NavBar = () => {
  return (
    <HeaderContainer>
      <LogoImage src="https://www.se.kmitl.ac.th/assets/se.png" alt="Logo" />
      <NavLinks>
        <BaseLink to="/home">Home</BaseLink>
        <BaseLink to="/curriculum">Program</BaseLink>
        <BaseLink to="/editor">Code Editor</BaseLink>
        <ProfileLink to="/profile">Profile</ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default NavBar;
