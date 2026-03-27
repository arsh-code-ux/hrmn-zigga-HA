import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArtistTypeScrollPage from "./pages/ArtistTypeScrollPage";
import ArtistsPage from "./pages/ArtistsPage";
import CollectionsPage from "./pages/CollectionsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArtistTypeScrollPage />} />
        <Route path="/artists/:type" element={<ArtistsPage />} />
        <Route path="/collections/:slug" element={<CollectionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
