import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { fetchSongs } from "../api/songs";
import { fetchInstruments } from "../api/instrumentApi";

const LEVEL_ORDER = {
  BEGINNER: 1,
  EASY: 2,
  NORMAL: 3,
  HARD: 4,
  EXPERT: 5,
};

export default function SongsPage() {
  const [searchParams] = useSearchParams();
  const instrumentFromQuery = searchParams.get("instrumentId") || "ALL";

  const [instrumentFilter, setInstrumentFilter] = useState(instrumentFromQuery);
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [tagFilter, setTagFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortOption, setSortOption] = useState("TITLE_ASC");

  useEffect(() => {
    setInstrumentFilter(instrumentFromQuery);
  }, [instrumentFromQuery]);

  const songsQuery = useQuery({
    queryKey: [
      "songs",
      instrumentFilter,
      levelFilter,
      tagFilter,
      keyword,
    ],
    queryFn: () =>
      fetchSongs({
        instrumentId: instrumentFilter !== "ALL" ? instrumentFilter : undefined,
        level: levelFilter !== "ALL" ? levelFilter : undefined,
        tag: tagFilter.trim() || undefined,
        q: keyword.trim() || undefined,
      }),
  });

  const instrumentQuery = useQuery({
    queryKey: ["instruments", "song-filter"],
    queryFn: fetchInstruments,
    staleTime: 1000 * 60 * 5,
  });

  const songs = songsQuery.data ?? [];
  const instruments = instrumentQuery.data ?? [];

  const availableInstruments = useMemo(() => {
    if (instruments.length > 0) {
      return instruments.map((instrument) => {
        const value = instrument.id ?? instrument._id;
        return {
          value,
          label: instrument.nameKo || instrument.nameEn || value,
        };
      });
    }

    const fallbackSet = new Set(
      songs.map((song) => song.instrumentId).filter(Boolean),
    );
    return Array.from(fallbackSet).map((value) => ({
      value,
      label: value,
    }));
  }, [instruments, songs]);

  const instrumentLabelMap = useMemo(() => {
    const map = new Map();
    instruments.forEach((instrument) => {
      const key = instrument.id ?? instrument._id;
      if (!key) return;
      map.set(key, instrument.nameKo || instrument.nameEn || key);
    });
    return map;
  }, [instruments]);

  const processedSongs = useMemo(() => {
    const target = [...songs];
    return target.sort((a, b) => {
      if (sortOption === "TITLE_ASC") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortOption === "TITLE_DESC") {
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortOption === "LEVEL_ASC" || sortOption === "LEVEL_DESC") {
        const av = LEVEL_ORDER[a.level] || 99;
        const bv = LEVEL_ORDER[b.level] || 99;
        return sortOption === "LEVEL_ASC" ? av - bv : bv - av;
      }
      return 0;
    });
  }, [songs, sortOption]);

  const appliedFilterCount =
    (instrumentFilter !== "ALL" ? 1 : 0) +
    (levelFilter !== "ALL" ? 1 : 0) +
    (tagFilter.trim() ? 1 : 0) +
    (keyword.trim() ? 1 : 0);

  if (songsQuery.isLoading) {
    return <div className="p-4">곡을 불러오는 중입니다...</div>;
  }

  if (songsQuery.isError) {
    return (
      <div className="p-4 text-red-500">
        곡을 불러오는 중 오류가 발생했습니다. <br />
        {songsQuery.error?.message}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">곡 목록</h1>
        <Link
          to="/"
          className="text-sm px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
        >
          홈으로
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 items-center text-sm bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">검색</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목, 아티스트 검색"
            className="w-48 rounded border px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">태그</span>
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="예: 피아노"
            className="w-32 rounded border px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">악기</span>
          <select
            className="border rounded px-2 py-1.5 text-sm"
            value={instrumentFilter}
            onChange={(e) => setInstrumentFilter(e.target.value)}
          >
            <option value="ALL">전체</option>
            {availableInstruments.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">난이도</span>
          <select
            className="border rounded px-2 py-1.5 text-sm"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="ALL">전체</option>
            <option value="BEGINNER">BEGINNER</option>
            <option value="EASY">EASY</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HARD">HARD</option>
            <option value="EXPERT">EXPERT</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">정렬</span>
          <select
            className="border rounded px-2 py-1.5 text-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="TITLE_ASC">제목 ↑</option>
            <option value="TITLE_DESC">제목 ↓</option>
            <option value="LEVEL_ASC">난이도 낮은순</option>
            <option value="LEVEL_DESC">난이도 높은순</option>
          </select>
        </div>

        {appliedFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setInstrumentFilter("ALL");
              setLevelFilter("ALL");
              setTagFilter("");
              setKeyword("");
            }}
            className="ml-auto text-xs px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            필터 초기화
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        총 {processedSongs.length}개 곡
        {appliedFilterCount > 0 && " (필터 적용됨)"}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {processedSongs.map((song) => {
          const songId = song.id || song._id;
          const instrumentName =
            instrumentLabelMap.get(song.instrumentId) || song.instrumentId || "미지정";

          return (
            <div
              key={songId}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Link
                    to={`/songs/${songId}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {song.title}
                  </Link>
                  {song.artist && (
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    악기:{" "}
                    <span className="font-medium text-gray-700">
                      {instrumentName}
                    </span>
                  </p>
                </div>
                <div className="text-right space-y-1 text-xs text-gray-500">
                  {song.level && (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      난이도 {song.level}
                    </span>
                  )}
                  {song.bpm && <p>{song.bpm} BPM</p>}
                  {song.key && <p>Key {song.key}</p>}
                </div>
              </div>

              {song.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {song.description}
                </p>
              )}

              {song.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 text-xs text-blue-600">
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

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 rounded-full bg-gray-100">
                  코드: {song.instrumentId || "미지정"}
                </span>
                {song.bpm && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">
                    {song.bpm} BPM
                  </span>
                )}
                {song.key && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100">
                    Key {song.key}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {processedSongs.length === 0 && (
        <p className="text-sm text-gray-500">
          조건에 맞는 곡이 없습니다. 다른 필터를 선택해 보세요.
        </p>
      )}
    </div>
  );
}
