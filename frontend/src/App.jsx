import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StudentChat from "./pages/StudentChat.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TrackTicket from "./pages/TrackTicket.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import SubmitRequest from "./pages/SubmitRequest.jsx";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<StudentChat />} />
        <Route path="/portal" element={<HelpCenter />} />
        <Route path="/submit" element={<SubmitRequest />} />
        <Route path="/track" element={<TrackTicket />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
