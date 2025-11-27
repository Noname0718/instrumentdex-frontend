import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstrumentsPage from "../pages/InstrumentsPage";
import InstrumentDetailPage from "../pages/InstrumentDetailPage";
import SongsPage from "../pages/SongsPage";
import SongDetailPage from "../pages/SongDetailPage";
import Navbar from "../components/Navbar";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminInstrumentsPage from "../pages/admin/AdminInstrumentsPage";
import AdminSongsPage from "../pages/admin/AdminSongsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-64 w-64 translate-x-1/3 rounded-full bg-indigo-200/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 px-4 pb-12 pt-8">
            <div className="mx-auto w-full max-w-6xl">
              <Routes>
                <Route path="/" element={<InstrumentsPage />} />
                <Route path="/instruments" element={<InstrumentsPage />} />
                <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
                <Route path="/songs" element={<SongsPage />} />
                <Route path="/songs/:id" element={<SongDetailPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminInstrumentsPage />} />
                  <Route path="instruments" element={<AdminInstrumentsPage />} />
                  <Route path="songs" element={<AdminSongsPage />} />
                </Route>
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
