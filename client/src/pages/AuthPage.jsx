import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { UserContext } from "../components/Context/UserContext";

const AuthPage = () => {
  const [signingIn, setSigningIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState("1");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName, // Changed from name
          last_name: lastName, // Changed from surname
          year: parseInt(year), // Convert to number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Sign Up failed");
      }

      const data = await response.json();
      // Store the token and user data
      localStorage.setItem("access_token", data.token.access_token);
      setUser({
        role: "user",
        first_name: firstName,
        last_name: lastName,
        year: parseInt(year),
        email,
      });
      alert("Sign Up successful!");
      setSigningIn(true);
    } catch (error) {
      console.error("Sign Up failed:", error.message);
      alert(`Sign Up failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email === "admin@testing.com" && password === "admin") {
        setUser({ role: "admin" });
        localStorage.setItem("userRole", "admin");
        alert("Admin Sign In successful!");
        navigate("/admin");
        return;
      }

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid Credentials");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      setUser({
        role: "user",
        ...data.user, // Spread the user data from response
      });
      localStorage.setItem("userRole", "user");
      alert("Sign In successful!");
      navigate("/home");
    } catch (error) {
      console.error("Sign In failed:", error.message);
      alert(`Sign In failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SignUpContainer signingIn={signingIn}>
        <Form onSubmit={handleSignUp}>
          <Title>Create Account</Title>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              margin: "8px 0",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          >
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
