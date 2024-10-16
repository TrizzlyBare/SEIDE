import React from "react";
import {
  OverlayContainer,
  Overlay as StyledOverlay,
  LeftOverlayPanel,
  RightOverlayPanel,
  Title,
  Paragraph,
  GhostButton,
} from "./Components";

const Overlay = ({ signingIn, toggle }) => (
  <OverlayContainer signingIn={signingIn}>
    <StyledOverlay signingIn={signingIn}>
      <LeftOverlayPanel signingIn={signingIn}>
        <Title>Welcome Back!</Title>
        <Paragraph>
          To keep connected with us, please sign in with your personal
          information.
        </Paragraph>
        <GhostButton onClick={() => toggle(true)}>Sign In</GhostButton>
      </LeftOverlayPanel>
      <RightOverlayPanel signingIn={signingIn}>
        <Title>Hello, Friend!</Title>
        <Paragraph>
          Enter your personal details and start your journey with us.
        </Paragraph>
        <GhostButton onClick={() => toggle(false)}>Sign Up</GhostButton>
      </RightOverlayPanel>
    </StyledOverlay>
  </OverlayContainer>
);

export default Overlay;
