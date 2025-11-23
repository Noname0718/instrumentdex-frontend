import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstrumentsPage from "../pages/InstrumentsPage";
import InstrumentDetailPage from "../pages/InstrumentDetailPage";
import SongsPage from "../pages/SongsPage";
import SongDetailPage from "../pages/SongDetailPage";
import Navbar from "../components/Navbar";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<InstrumentsPage />} />
          <Route path="/instruments" element={<InstrumentsPage />} />
          <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
