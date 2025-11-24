import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSongDetail } from "../api/songs";

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

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <Link
        to="/songs"
        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
      >
        ← 곡 목록으로
      </Link>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{song.title}</h1>
        {song.artist && <p className="text-gray-600">{song.artist}</p>}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {song.genre && <span>장르: {song.genre}</span>}
          {song.difficulty && <span>난이도: {song.difficulty}</span>}
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

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">악기별 섹션</h2>
        {song.sections?.length === 0 && (
          <p className="text-sm text-gray-500">
            아직 등록된 섹션이 없습니다.
          </p>
        )}
        {song.sections?.map((section, idx) => (
          <div
            key={`${section.instrumentId}-${idx}`}
            className="border rounded-lg p-4 bg-white flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold">
                악기: {section.instrumentId}
              </p>
              <p className="text-xs text-gray-600">
                역할: {section.role} / 난이도: {section.level ?? "미지정"}
              </p>
              {section.note && (
                <p className="text-xs text-gray-500 mt-1">{section.note}</p>
              )}
            </div>
            <div className="flex gap-2">
              {section.youtubeUrl && (
                <a
                  href={section.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1 border rounded-full hover:bg-gray-200"
                >
                  연주 영상
                </a>
              )}
              {section.sheetUrl && (
                <a
                  href={section.sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs px-3 py-1 border rounded-full hover:bg-gray-200"
                >
                  악보
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
