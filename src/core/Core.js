import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../main/Main";

function Core() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} exact/>
      </Routes>
    </BrowserRouter>
  );
}

export default Core;