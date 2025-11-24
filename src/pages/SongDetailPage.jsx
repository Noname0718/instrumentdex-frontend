import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSongById } from "../api/songs";

export default function SongDetailPage() {
  const { id } = useParams();

  const {
    data: song,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["song", id],
    queryFn: () => fetchSongById(id),
  });

  if (isLoading) {
    return <div className="p-4">연습곡 불러오는 중...</div>;
  }

  if (isError || !song) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/70 p-6 text-sm text-red-600">
        연습곡을 불러오는 중 오류가 발생했습니다.
        <br />
        {error?.message}
      </div>
    );
  }

  const youtubeEmbedUrl =
    song.youtubeUrl && song.youtubeUrl.includes("watch?v=")
      ? song.youtubeUrl.replace("watch?v=", "embed/")
      : song.youtubeUrl;

  const instrumentName =
    song.instrumentName || song.mainInstrument || song.instrument?.nameKo || "";
  const youtubeSearchQuery = encodeURIComponent(
    `${song.title} ${instrumentName}`.trim()
  );

  return (
    <div className="space-y-6">
      <Link
        to="/songs"
        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
      >
        ← 연습곡 목록으로
      </Link>

      <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-500">
              Practice Song
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{song.title}</h1>
            <p className="text-base text-slate-500">{song.artist}</p>
          </div>
          <div className="flex gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              난이도 {song.level || "-"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              BPM {song.bpm || "-"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Key {song.key || "-"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <section className="space-y-5 lg:col-span-3">
            <article className="rounded-2xl border border-slate-100 bg-white/80 p-5 text-sm leading-relaxed text-slate-700 shadow-inner">
              {song.description ||
                "이 곡에 대한 설명이 아직 등록되지 않았습니다. 관리자에게 문의해 주세요."}
            </article>

            {song.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {song.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 font-semibold text-indigo-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">YouTube</h2>
                <span className="text-xs text-slate-500">
                  {song.youtubeUrl ? "등록된 영상" : "직접 검색"}
                </span>
              </div>

              {song.youtubeUrl ? (
                youtubeEmbedUrl?.includes("embed/") ? (
                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
                    <iframe
                      className="h-full w-full"
                      src={youtubeEmbedUrl}
                      title={song.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={song.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
                  >
                    YouTube에서 열기 →
                  </a>
                )
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  등록된 YouTube 링크가 없습니다. 아래 검색 버튼으로 바로 찾아보세요.
                </p>
              )}

              <a
                href={`https://www.youtube.com/results?search_query=${youtubeSearchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:opacity-90"
              >
                YouTube 검색
              </a>
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-lg shadow-slate-200 lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              곡 정보
            </h3>
            <dl className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <dt>등록일</dt>
                <dd className="font-medium">
                  {song.createdAt ? new Date(song.createdAt).toLocaleDateString() : "-"}
                </dd>
              </div>
              {song.updatedAt && (
                <div className="flex justify-between">
                  <dt>마지막 수정</dt>
                  <dd className="font-medium">
                    {new Date(song.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>악기</dt>
                <dd className="font-medium">{instrumentName || "-"}</dd>
              </div>
            </dl>

            {song.instrumentId && (
              <Link
                to={`/instruments/${song.instrumentId}`}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-100"
              >
                이 곡의 악기 정보 보기
              </Link>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
