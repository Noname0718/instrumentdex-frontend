import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSongDetail } from "../api/songs";
import { fetchInstrumentDetail } from "../api/instrumentApi";

export default function SongDetailPage() {
  const { id } = useParams();

  const {
    data: song,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["song-detail", id],
    queryFn: () => fetchSongDetail(id),
    enabled: !!id,
  });

  const instrumentQuery = useQuery({
    queryKey: ["instrument", song?.instrumentId],
    queryFn: () => fetchInstrumentDetail(song.instrumentId),
    enabled: !!song?.instrumentId,
  });

  if (isLoading) {
    return <div className="p-4">곡 정보를 불러오는 중...</div>;
  }

  if (isError || !song) {
    return (
      <div className="p-4 text-red-500">
        곡 정보를 불러올 수 없습니다.
        <br />
        {error?.message}
      </div>
    );
  }

  const instrumentName =
    song.instrumentName ||
    instrumentQuery.data?.nameKo ||
    instrumentQuery.data?.nameEn ||
    song.instrumentId ||
    "";
  const youtubeSearchQuery = [song.title, instrumentName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const youtubeSearchUrl = youtubeSearchQuery
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        youtubeSearchQuery
      )}`
    : null;
  const youtubePracticeUrl = song.youtubeUrl || youtubeSearchUrl;
  const youtubeButtonLabel = song.youtubeUrl ? "유튜브" : "유튜브에서 검색";

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <Link
        to="/songs"
        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
      >
        ← 곡 목록으로
      </Link>

      <header className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold">{song.title}</h1>
          {song.artist && <p className="text-gray-600">{song.artist}</p>}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {song.instrumentId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
              악기:
              <strong className="font-semibold text-gray-800">
                {instrumentName}
              </strong>
            </span>
          )}
          {song.level && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
              난이도: {song.level}
            </span>
          )}
          {song.bpm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
              {song.bpm} BPM
            </span>
          )}
          {song.key && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
              Key {song.key}
            </span>
          )}
        </div>

        {song.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {song.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {song.description && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">설명</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {song.description}
          </p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">연습 자료</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          {youtubePracticeUrl && (
            <a
              href={youtubePracticeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-5 py-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition duration-150"
            >
              {youtubeButtonLabel}
            </a>
          )}
          {song.sheetUrl && (
            <a
              href={song.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-blue-600 hover:bg-blue-50"
            >
              악보
            </a>
          )}
          {!youtubePracticeUrl && !song.sheetUrl && (
            <p className="text-sm text-gray-500">
              등록된 연습 자료가 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
