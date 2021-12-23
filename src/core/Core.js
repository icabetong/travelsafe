import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { useAuth } from "../auth/Provider";
import About from "../about/About";
import Account from "../account/Account";
import Console from "../console/Console";
import Dashboard from "../dashboard/Dashboard";
import Main from "../main/Main";
import Landing from "../main/Landing";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import theme from "../shared/Theme";
import ConditionalRoute from "../shared/custom/ConditionalRoute";

function Core() {
  const { user } = useAuth();

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Main/> : <Landing/>} 
            exact
          />
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
            path="/account" 
            element={
              <ConditionalRoute 
                to="/signin">
                <Account/>
              </ConditionalRoute>
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
            path="/console" 
            element={
              <ConditionalRoute 
                to="/signin">
                <Console/>
              </ConditionalRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default Core;