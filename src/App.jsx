import React from "react";
import { Container } from "./components/Auth/Components";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import Overlay from "./components/Auth/Overlay";

function App() {
  const [signIn, toggle] = React.useState(true);

  return (
    <Container>
      <SignUp signingIn={signIn} />
      <SignIn signingIn={signIn} />
      <Overlay signingIn={signIn} toggle={toggle} />
    </Container>
  );
}

export default App;
