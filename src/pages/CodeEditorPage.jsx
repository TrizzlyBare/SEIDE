import React from "react";
import { Box } from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor/CodeEditor";

const CodeEditorPage = () => (
  <Box minH="75vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
    <CodeEditor />
  </Box>
);

export default CodeEditorPage;
