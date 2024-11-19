import React from "react";
import {
  HeaderContainer,
  NavLinks,
  BaseLink,
  ProfileLink,
} from "./NavBarStyle";

const NavBar = () => {
  return (
    <HeaderContainer>
      <NavLinks>
        <BaseLink to="/home">Home</BaseLink>
        <BaseLink to="/editor">Code Editor</BaseLink>
        <ProfileLink to="/profile">Profile</ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default NavBar;
