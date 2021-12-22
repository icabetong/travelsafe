import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Console from "../console/Console";
import Dashboard from "../dashboard/Dashboard";
import Main from "../main/Main";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import theme from "../shared/Theme";
import { AuthProvider } from "../auth/Provider";
import PrivateRoute from "../shared/custom/PrivateRoute";

function Core() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main/>} exact/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/dashboard" element={<PrivateRoute to="/signin"><Dashboard/></PrivateRoute>}/>
            <Route path="/console" element={<PrivateRoute to="/signin"><Dashboard/></PrivateRoute>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default Core;