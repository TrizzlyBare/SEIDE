import React from "react";
import { Link } from "react-router-dom";
import { HeaderContainer, NavLinks, ProfileLink } from "./headerStyle"; // Import ProfileLink

const Header = () => {
  return (
    <HeaderContainer>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/auth">Auth</Link>
        <ProfileLink to="/profile">Profile</ProfileLink>
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
