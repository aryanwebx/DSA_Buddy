import { Routes, Route } from "react-router";
import LandingPage from "./Pages/LandingPage";
import Chatbot from "./Pages/Chatbot";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/chatbot" element={<Chatbot/>}></Route>
    </Routes>
  );
}
