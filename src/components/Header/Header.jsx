import React from "react";
import { Link } from "react-router-dom";
import {
  HeaderContainer,
  NavLinks,
  ProfileLink,
  BaseLink,
} from "./headerStyle"; // Import ProfileLink

const Header = () => {
  return (
    <HeaderContainer>
      <NavLinks>
        <BaseLink to="/">Home</BaseLink>
        <BaseLink to="/auth">Auth</BaseLink>
        <BaseLink to="/editor">Editor</BaseLink>
        <ProfileLink to="/profile">Profile</ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
