import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full border-b mb-4 bg-white/80 backdrop-blur">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex gap-4 text-sm font-semibold">
        <Link to="/instruments" className="hover:text-blue-600">
          악기 도감
        </Link>
        <Link to="/songs" className="hover:text-blue-600">
          연습곡
        </Link>
      </nav>
    </header>
  );
}
