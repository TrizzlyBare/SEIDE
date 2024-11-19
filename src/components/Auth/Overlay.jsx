import React from "react";
import styled from "styled-components";
import { Title, Paragraph, GhostButton } from "./Components";

const StyledDiv = styled.div`
  ${(props) =>
    props.signingIn &&
    `
    transform: translateX(0);
  `}
  ${(props) =>
    !props.signingIn &&
    `
    transform: translateX(50%);
  `}
  transition: transform 0.6s ease-in-out;
`;

const Overlay = ({ signingIn, toggle }) => (
  <StyledDiv signingIn={signingIn}>
    <StyledDiv signingIn={signingIn}>
      <StyledDiv signingIn={signingIn}>
        <Title>Welcome Back!</Title>
        <Paragraph>
          To keep connected with us, please sign in with your personal
          information.
        </Paragraph>
        <GhostButton onClick={() => toggle(true)}>Sign In</GhostButton>
      </StyledDiv>
      <StyledDiv signingIn={signingIn}>
        <Title>Hello, Friend!</Title>
        <Paragraph>
          Enter your personal details and start your journey with us.
        </Paragraph>
        <GhostButton onClick={() => toggle(false)}>Sign Up</GhostButton>
      </StyledDiv>
    </StyledDiv>
  </StyledDiv>
);

export default Overlay;
