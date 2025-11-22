import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <main className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4">InstrumentDex</h1>
            <p className="text-slate-300 mb-6">
                악기 도감 + 연습곡 정보 플랫폼
            </p>

            <div className="grid gap-4 md:grid-cols-2">
                <Link
                    to="/instruments"
                    className="rounded-2xl border border-slate-700 p-4 hover:bg-slate-100 transition bg-white"
                >
                    <h2 className="text-xl font-semibold mb-2 text-slate-900">악기 도감</h2>
                    <p className="text-sm text-slate-500">
                        악기 목록과 상세 정보를 확인할 수 있어요.
                    </p>
                </Link>

                <Link
                    to="/songs"
                    className="rounded-2xl border border-slate-700 p-4 hover:bg-slate-100 transition bg-white"
                >
                    <h2 className="text-xl font-semibold mb-2 text-slate-900">연습곡 목록</h2>
                    <p className="text-sm text-slate-500">
                        악기별 연습곡을 난이도/태그 기준으로 탐색할 수 있어요.
                    </p>
                </Link>
            </div>

        </main>
    );
}
