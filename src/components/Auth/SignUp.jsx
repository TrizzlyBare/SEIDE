import React from "react";
import { SignUpContainer, Form, Title, Input, Button } from "./Components";

const SignUp = ({ signingIn }) => (
  <SignUpContainer signingIn={signingIn}>
    <Form>
      <Title>Create Account</Title>
      <Input type="text" placeholder="Name" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button>Sign Up</Button>
    </Form>
  </SignUpContainer>
);

export default SignUp;
