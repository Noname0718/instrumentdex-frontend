import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSongById } from "../api/songs";

export default function SongDetailPage() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["song", id],
    queryFn: () => fetchSongById(id),
  });

  if (isLoading) {
    return <div className="p-4">연습곡 불러오는 중...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        연습곡을 불러오는 중 오류가 발생했습니다. <br />
        {error?.message}
      </div>
    );
  }

  const song = data;

  const youtubeEmbedUrl =
    song.youtubeUrl && song.youtubeUrl.includes("watch?v=")
      ? song.youtubeUrl.replace("watch?v=", "embed/")
      : song.youtubeUrl;

  const instrumentName =
    song.instrumentName || song.mainInstrument || song.instrument?.nameKo || "";
  const youtubeSearchQuery = encodeURIComponent(
    `${song.title} ${song.artist || ""} ${instrumentName}`.trim()
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/songs" className="text-sm text-blue-600">
        ← 연습곡 목록으로
      </Link>

      <h1 className="mt-2 text-2xl font-bold">{song.title}</h1>
      <p className="text-gray-600 mb-2">{song.artist}</p>

      <div className="text-sm text-gray-500 space-x-2 mb-4">
        <span>난이도: {song.level}</span>
        <span>· BPM: {song.bpm}</span>
        <span>· Key: {song.key || "-"}</span>
      </div>

      <p className="mb-4 text-gray-800">{song.description}</p>

      {song.tags?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-blue-700">
          {song.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 border border-blue-200 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {song.instrumentId && (
        <div className="mb-4">
          <Link
            to={`/instruments/${song.instrumentId}`}
            className="text-sm text-indigo-600 underline"
          >
            이 곡의 악기 정보 보러가기 →
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">YouTube</h2>

        {song.youtubeUrl ? (
          youtubeEmbedUrl.includes("embed/") ? (
            <div className="aspect-video w-full max-w-xl">
              <iframe
                className="w-full h-full rounded-lg"
                src={youtubeEmbedUrl}
                title={song.title}
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <a
              href={song.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              YouTube에서 열기
            </a>
          )
        ) : (
          <p className="text-sm text-gray-500">등록된 YouTube 링크가 없습니다.</p>
        )}

        <a
          href={`https://www.youtube.com/results?search_query=${youtubeSearchQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 px-5 py-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition duration-150"
        >
          유튜브에서 제목·가수·악기로 검색하기
        </a>
      </div>
    </div>
  );
}
