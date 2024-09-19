import React from "react";
import {
  HeaderContainer,
  NavLinks,
  ProfileLink,
  BaseLink,
} from "./headerStyle"; // Import BaseLink

const Header = () => {
  return (
    <HeaderContainer>
      <NavLinks>
        <BaseLink to="/">Home</BaseLink>
        <BaseLink to="/auth">Auth</BaseLink>
        <BaseLink to="/editor">IDE</BaseLink>
        <ProfileLink to="/profile">Profile</ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
