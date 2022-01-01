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
import PrivateRoute from "../shared/custom/PrivateRoute";
import Verification from "../auth/Verification";

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
              <PrivateRoute 
                to="/signin">
                <Account/>
              </PrivateRoute>
          }/>
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute 
                to="/signin">
                <Dashboard/>
              </PrivateRoute>
          }/>
          <Route 
            path="/console" 
            element={
              <PrivateRoute 
                to="/signin">
                <Console/>
              </PrivateRoute>
          }/>
          <Route
            path="/verify"
            element={
              <PrivateRoute
                to="/signin">
                <Verification/>
              </PrivateRoute>
            }/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default Core;