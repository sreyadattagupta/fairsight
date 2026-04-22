import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/upload"    element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history"   element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;