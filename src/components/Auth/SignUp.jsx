import React, { useState } from "react";
import { SignUpContainer, Form, Title, Input, Button } from "./Components";
import { register } from "./api";

const SignUp = ({ signingIn }) => {
  const [name, setName] = useState("");
  const [Surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(name, Surname, email, password);
      console.log("Registration successful:", data);
      // Handle successful registration (e.g., redirect to login)
    } catch (err) {
      setError(err.detail);
    }
  };

  return (
    <SignUpContainer signingIn={signingIn}>
      <Form onSubmit={handleSubmit}>
        <Title>Create Account</Title>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="SurName"
          value={Surname}
          onChange={(e) => setSurname(e.target.value)}
        />
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit">Sign Up</Button>
      </Form>
    </SignUpContainer>
  );
};

export default SignUp;
