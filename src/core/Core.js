import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Main from "../main/Main";
import Auth from "../auth/Auth";
import theme from "../shared/Theme";

function Core() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>} exact/>
          <Route path="/signin/:type" element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default Core;