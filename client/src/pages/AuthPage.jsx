import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [signingIn, setSigningIn] = useState(true); // Toggle between Sign-In and Sign-Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [Year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8000/api/users', {
        email,
        password,
      });
      alert("Sign Up successful!");
      setSigningIn(true); // Toggle to SignIn form
    } catch (error) {
      console.error("Sign Up failed:", error.response ? error.response.data : error.message);
      alert("Sign Up failed: Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSignIn = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8000/api/token', {
        username: email,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      alert("Sign In successful!");
      navigate("/app");
    } catch (error) {
      console.error("Sign In failed:", error.response ? error.response.data : error.message);
      alert("Sign In failed: Invalid Credentials");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container>
      {/* SignUpContainer: Only passes 'signingIn' prop to styled-components */}
      <SignUpContainer signingIn={signingIn}>
        <Form onSubmit={handleSignUp}>
          <Title>Create Account</Title>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="SurName"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
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
          <select id="year" name="year" value={Year} onChange={(e) => setYear(e.target.value)}>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Form>
      </SignUpContainer>

      {/* SignInContainer: Only passes 'signingIn' prop to styled-components */}
      <SignInContainer signingIn={signingIn}>
        <Form onSubmit={handleSignIn}>
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
          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Form>
      </SignInContainer>

      {/* OverlayContainer: Only passes 'signingIn' prop to styled-components */}
      <OverlayContainer signingIn={signingIn}>
        <Overlay signingIn={signingIn}>
          <LeftOverlayPanel signingIn={signingIn}>
            <Title>Welcome Back!</Title>
            <Paragraph>
              To keep connected with us, please login with your personal info
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
