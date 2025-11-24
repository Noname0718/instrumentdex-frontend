import { Link } from "react-router-dom";

const highlights = [
    { title: "40+ 악기", description: "사진·태그·난이도까지 한번에" },
    { title: "실전 연습곡", description: "난이도·악기 필터로 빠르게 탐색" },
    { title: "YouTube 연동", description: "악보와 영상까지 한 곳에서" },
];

export default function HomePage() {
    return (
        <div className="space-y-10">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-700 px-8 py-10 text-white shadow-2xl">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent)]" />
                <div className="relative z-10 max-w-2xl space-y-6">
                    <p className="text-sm uppercase tracking-[0.4em] text-white/70">
                        Practice Library
                    </p>
                    <h1 className="text-4xl font-bold leading-tight">
                        악기 도감과 연습곡을
                        <br />
                        한 페이지에서
                    </h1>
                    <p className="text-base text-white/80">
                        InstrumentDex는 악기별 정보와 추천 연습곡, YouTube 자료를 한 번에
                        모아줍니다. 오늘 연습해야 할 곡과 악기를 가장 빠르게 찾으세요.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/songs"
                            className="rounded-full bg-white/95 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-900/40 transition hover:bg-white"
                        >
                            연습곡 바로 보기
                        </Link>
                        <Link
                            to="/instruments"
                            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            악기 도감 살펴보기
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {highlights.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-white/40 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur"
                    >
                        <p className="text-sm font-semibold text-blue-500">{item.title}</p>
                        <p className="mt-2 text-base text-slate-600">{item.description}</p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
                        Instrument Atlas
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">악기 도감</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        계열·난이도로 필터링하면서 악기 설명, 태그, 대표 이미지까지 한 눈에
                        정리되어 있습니다.
                    </p>
                    <Link
                        to="/instruments"
                        className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
                    >
                        악기 페이지로 이동 →
                    </Link>
                </article>

                <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                        Practice Songs
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">연습곡 컬렉션</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        악기/난이도/정렬 필터와 YouTube·악보 링크 정보를 통해 실제 연습에 바로
                        사용할 곡만 추렸습니다.
                    </p>
                    <Link
                        to="/songs"
                        className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600 hover:underline"
                    >
                        연습곡 페이지로 이동 →
                    </Link>
                </article>
            </section>
        </div>
    );
}
