import React from "react";
import {
  SignInContainer,
  Form,
  Title,
  Input,
  Button,
  Anchor,
} from "./Components";

const SignIn = ({ signingIn }) => (
  <SignInContainer signingIn={signingIn}>
    <Form>
      <Title>Sign In</Title>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Anchor href="#">Forgot your password?</Anchor>
      <Button>Sign In</Button>
    </Form>
  </SignInContainer>
);

export default SignIn;
