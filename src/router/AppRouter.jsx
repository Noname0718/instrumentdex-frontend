import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import InstrumentsPage from "../pages/InstrumentsPage";
import InstrumentDetailPage from "../pages/InstrumentDetailPage";
import SongsPage from "../pages/SongsPage";
import SongDetailPage from "../pages/SongDetailPage";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/instruments" element={<InstrumentsPage />} />
            <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
            <Route path="/songs" element={<SongsPage />} />
            <Route path="/songs/:id" element={<SongDetailPage />} />
        </Routes>
    );
}
