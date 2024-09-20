import React from "react";
import { Link } from "react-router-dom";
import {
  HeaderContainer,
  NavLinks,
  ProfileLink,
  BaseLink,
} from "./headerStyle"; // Import ProfileLink

//The top and left should be 0 and the width should be 100%.


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
