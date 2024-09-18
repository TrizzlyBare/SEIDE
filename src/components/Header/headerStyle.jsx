// headerStyle.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: #2d3748;
  color: white;
  padding: 15px;
`;

export const NavLinks = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;

  a {
    text-decoration: none;
    color: white;
    padding: 10px;
    font-size: 1.2rem;
  }
`;

export const ProfileLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  font-size: 1.2rem;
  position: relative;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #4a5568; /* Background color change on hover */
    color: #fbbf24; /* Text color change to yellow on hover */
    border-radius: 8px; /* Rounded corners on hover */

    &::before {
      content: "";
      position: absolute;
      left: -10px;
      width: 5px;
      height: 100%;
      background-color: #fbbf24; /* Yellow bar on hover */
      border-radius: 5px 0 0 5px;
    }

    &::after {
      content: "View and edit your profile";
      position: absolute;
      top: 110%; /* Position below the Profile link */
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 12px;
      background-color: #333; /* Dark background for the text box */
      color: #fff;
      font-size: 0.9rem;
      white-space: nowrap;
      border-radius: 4px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    &:hover::after {
      opacity: 1;
      visibility: visible;
    }
  }
`;
