import { NavLink, Outlet } from "react-router-dom";

const NAV_LINKS = [
  { to: "/admin/instruments", label: "악기 관리" },
  { to: "/admin/songs", label: "연습곡 관리" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">관리자</p>
            <h1 className="text-2xl font-bold text-slate-900">콘텐츠 관리</h1>
          </div>
          <p className="text-sm text-slate-500">
            악기 / 연습곡 데이터를 간단히 조회하고 수정할 수 있습니다.
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <nav className="w-48 shrink-0 rounded-2xl border bg-white p-4 shadow-sm">
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center rounded-xl px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <section className="flex-1 rounded-2xl border bg-white p-6 shadow-sm">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
