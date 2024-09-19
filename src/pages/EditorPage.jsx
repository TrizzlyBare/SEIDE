// src/pages/EditorPage.jsx
import React from "react";
import styled from "styled-components";
import { Box, Heading } from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor/CodeEditor"; // Corrected import path

const EditorPageContainer = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const EditorPage = () => {
  return (
    <EditorPageContainer>
      <Box as="header" bg="purple.600" color="white" py={4} px={6}>
        <Heading as="h1" size="lg">
          Editor Page
        </Heading>
      </Box>
      <Box mt={4}>
        <CodeEditor />
      </Box>
    </EditorPageContainer>
  );
};

export default EditorPage;
