import React, { useState } from "react";
import { SignInContainer, Form, Title, Input, Button, Anchor } from "./Components";
import { login } from "./api";

const SignIn = ({ signingIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log("Login successful:", data);
      // Handle successful login (e.g., store token, redirect)
    } catch (err) {
      setError(err.detail);
    }
  };

  return (
    <SignInContainer signingIn={signingIn}>
      <Form onSubmit={handleSubmit}>
        <Title>Sign In</Title>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Anchor href="#">Forgot your password?</Anchor>
        <Button type="submit">Sign In</Button>
      </Form>
    </SignInContainer>
  );
};

export default SignIn;