import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ArtistTypeScrollPage from "./pages/ArtistTypeScrollPage";
import ArtistsPage from "./pages/ArtistsPage";
import "./App.css";

function AppContent() {
  

  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<ArtistTypeScrollPage />} />
          <Route path="/artists/:type" element={<ArtistsPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
