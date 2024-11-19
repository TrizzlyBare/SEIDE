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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitSignUp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.detail);
      } else {
        const data = await response.json();
        setToken(data.access_token); 
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred during sign up.");
      
    }
  };

  const handleSubmit = (e) => {
    console.log("Signup Button clicked!");
    e.preventDefault();
    submitSignUp();
  };

  return (
    <SignInContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Button type="submit">Sign Up</Button>
      </Form>
    </SignInContainer>
  );
};

export default SignUp;
