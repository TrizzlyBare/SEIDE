import React, { useState } from "react";
import {
  Container,
  SignUpContainer,
  SignInContainer,
  OverlayContainer,
  Overlay,
  Form,
  Title,
  Input,
  Button,
  Paragraph,
  LeftOverlayPanel,
  RightOverlayPanel,
} from "../components/Auth/Components";

const AuthPage = () => {
  const [signingIn, setSigningIn] = useState(true);

  return (
    <Container>
      <SignUpContainer signingIn={signingIn}>
        <Form>
          <Title>Create Account</Title>
          <Input type="text" placeholder="Name" />
          <Input type="text" placeholder="Surname" />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Sign Up</Button>
        </Form>
      </SignUpContainer>

      <SignInContainer signingIn={signingIn}>
        <Form>
          <Title>Sign In</Title>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Sign In</Button>
        </Form>
      </SignInContainer>

      <OverlayContainer signingIn={signingIn}>
        <Overlay signingIn={signingIn}>
          <LeftOverlayPanel signingIn={signingIn}>
            <Title>Welcome Back!</Title>
            <Paragraph>
              To keep connected with us please login with your personal info
            </Paragraph>
            <Button onClick={() => setSigningIn(true)}>Sign In</Button>
          </LeftOverlayPanel>
          <RightOverlayPanel signingIn={signingIn}>
            <Title>Hello, Friend!</Title>
            <Paragraph>
              Enter your personal details and start your journey with us
            </Paragraph>
            <Button onClick={() => setSigningIn(false)}>Sign Up</Button>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};

export default AuthPage;
