import React, { useState, useContext } from "react";
import {
  SignInContainer,
  Form,
  Title,
  Input,
  Button,
  Anchor,
} from "./Components";
import { UserContext } from "../Context/UserContext";
import Overlay from "./Overlay";
import SignUp from "./SignUp";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const [signingIn, setSigningIn] = useState(true);

  const submitLogin = async () => {
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.detail);
      } else {
        const data = await response.json();
        setToken(data.access_token);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  const handleSubmit = (e) => {
    console.log("Login button clicked");
    e.preventDefault();
    submitLogin();
  };

  return (
    <SignInContainer>
      {signingIn ? (
        <Form onSubmit={handleSubmit}>
          <Title>Sign In</Title>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Anchor href="#">Forgot your password?</Anchor>
          <Button type="submit">Sign In</Button>
        </Form>
      ) : (
        <SignUp />
      )}
      <Overlay signingIn={signingIn} toggle={setSigningIn} />
    </SignInContainer>
  );
};

export default SignIn;
