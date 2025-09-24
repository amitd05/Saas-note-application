import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Signup from "./pages/Signup";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}
