import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import About from "../about/About";
import Account from "../account/Account";
import Console from "../console/Console";
import Dashboard from "../dashboard/Dashboard";
import Main from "../main/Main";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import theme from "../shared/Theme";
import { AuthProvider } from "../auth/Provider";
import ConditionalRoute from "../shared/custom/ConditionalRoute";

function Core() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main/>} exact/>
            <Route path="/about" element={<About/>}/>
            <Route 
              path="/signin" 
              element={
              <SignIn/>
            }/>
            <Route 
              path="/signup" 
              element={
                <SignUp/>
            }/>
            <Route 
              path="/dashboard" 
              element={
                <ConditionalRoute 
                  to="/signin">
                  <Dashboard/>
                </ConditionalRoute>
            }/>
            <Route 
              path="/account" 
              element={
                <ConditionalRoute 
                  to="/signin">
                  <Account/>
                </ConditionalRoute>
            }/>
            <Route 
              path="/console" 
              element={
                <ConditionalRoute 
                  to="/signin">
                  <Console/>
                </ConditionalRoute>
            }/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default Core;