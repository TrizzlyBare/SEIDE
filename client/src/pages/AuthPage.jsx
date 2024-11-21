import React, { useContext, useState, useEffect } from "react";
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

const UserRole = {
  YEAR1: "YEAR1",
  YEAR2: "YEAR2",
  YEAR3: "YEAR3",
  YEAR4: "YEAR4",
  ADMIN: "ADMIN",
};

const LogoImage = ({ src, alt }) => (
  <img src={src} alt={alt} style={{ width: '80%', maxWidth: '200px', margin: '0 auto' }} />
);

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

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const response = await fetch("http://localhost:8000/initialize-admin", {
          method: "POST",
        });
        if (!response.ok) {
          console.error("Failed to initialize admin");
        } else {
          const data = await response.json();
          console.log("Admin initialization response:", data);
        }
      } catch (error) {
        console.error("Admin initialization error:", error);
      }
    };

    initializeAdmin();
  }, []);

  const getRoleFromYear = (year) => {
    return UserRole[`YEAR${year}`] || UserRole.YEAR1;
  };

  const handleRoleBasedNavigation = (role) => {
    console.log("Navigating based on role:", role);
    switch (role) {
      case UserRole.ADMIN:
        navigate("/admin");
        console.log("Navigating to admin");
        break;
      case UserRole.YEAR1:
      case UserRole.YEAR2:
      case UserRole.YEAR3:
      case UserRole.YEAR4:
        navigate("/home");
        break;
      default:
        throw new Error("Invalid role received from server");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const signUpData = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        year: parseInt(year),
        role: getRoleFromYear(year),
      };

      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Sign Up failed");
      }

      // Store token
      localStorage.setItem("access_token", data.token.access_token);

      // Set user in context with all data from response
      setUser({
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        year: data.user.year,
        role: data.user.role,
      });

      alert("Sign Up successful!");
      navigate("/");
    } catch (error) {
      console.error("Sign Up failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First try to authenticate
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // Store token
      localStorage.setItem("access_token", data.access_token);

      // User data should now be included in the token response
      setUser({
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        year: data.user.year,
        role: data.role,
      });

      console.log("User authenticated successfully:", data);

      // Optional: Verify role access
      const roleCheckResponse = await fetch(
        "http://localhost:8000/api/role-check",
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );

      if (!roleCheckResponse.ok) {
        throw new Error("Failed to verify role access");
      }

      const roleData = await roleCheckResponse.json();

      console.log("Role check response:", roleData);

      handleRoleBasedNavigation(roleData.role);
    } catch (error) {
      console.error("Sign In failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setYear("1");
  };

  const handleOverlayClick = (isSignIn) => {
    setSigningIn(isSignIn);
    resetForm();
  };

  return (
    <Container>
      <SignUpContainer signingIn={signingIn}>
        <Form onSubmit={handleSignUp}>
          <Title>Create Account</Title>
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
          <LogoImage
          src="https://www.se.kmitl.ac.th/assets/se.png"
          alt="Logo"
        />
            <Paragraph>
              To keep connected with us, please login with your personal info
            </Paragraph>
            <Button onClick={() => handleOverlayClick(true)}>Sign In</Button>
          </LeftOverlayPanel>
          <RightOverlayPanel signingIn={signingIn}>
          <LogoImage
          src="https://www.se.kmitl.ac.th/assets/se.png"
          alt="Logo"
        />
            <Paragraph>
              Enter your personal details and start your journey with us
            </Paragraph>
            <Button onClick={() => handleOverlayClick(false)}>Sign Up</Button>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};

export default AuthPage;