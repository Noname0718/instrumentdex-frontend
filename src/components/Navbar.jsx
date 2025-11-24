import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "악기 도감", to: "/instruments" },
  { label: "연습곡", to: "/songs" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900"
        >
          <span className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 px-2 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
            IDX
          </span>
          InstrumentDex
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 transition-colors",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/songs"
            className="ml-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200/60 transition hover:opacity-90"
          >
            연습 시작
          </Link>
        </nav>
      </div>
    </header>
  );
}
