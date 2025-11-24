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
};

export default function SongsPage() {
  const [searchParams] = useSearchParams();
  const instrumentFromQuery = searchParams.get("instrumentId") || "ALL";

  const [instrumentFilter, setInstrumentFilter] = useState(instrumentFromQuery);
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("TITLE_ASC");
  const [keyword, setKeyword] = useState("");

  const songsQuery = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
  });

  const instrumentQuery = useQuery({
    queryKey: ["instruments", "song-filter"],
    queryFn: () => fetchInstruments(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setInstrumentFilter(instrumentFromQuery);
  }, [instrumentFromQuery]);

  const songs = songsQuery.data || [];
  const instruments = instrumentQuery.data || [];

  const availableInstruments = useMemo(() => {
    if (instruments.length > 0) {
      return instruments.map((instrument) => ({
        value: String(instrument.id),
        label: instrument.nameKo || instrument.nameEn || instrument.id,
      }));
    }

    const fallback = new Set();
    songs.forEach((song) => {
      if (song.instrumentId) {
        fallback.add(String(song.instrumentId));
      }
    });
    return Array.from(fallback).map((value) => ({ value, label: value }));
  }, [instruments, songs]);

  const processedSongs = useMemo(() => {
    const filtered = songs.filter((song) => {
      const instrumentMatch =
        instrumentFilter === "ALL" ||
        String(song.instrumentId) === instrumentFilter;
      const levelMatch =
        levelFilter === "ALL" || song.level === levelFilter;
      const normalizedKeyword = keyword.trim().toLowerCase();
      const keywordMatch =
        normalizedKeyword === "" ||
        [
          song.title,
          song.artist,
          song.description,
          song.instrumentName,
          song.mainInstrument,
          song.instrument?.nameKo,
          song.instrument?.nameEn,
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedKeyword));
      return instrumentMatch && levelMatch && keywordMatch;
    });

    return filtered.sort((a, b) => {
      if (sortOption === "TITLE_ASC") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortOption === "TITLE_DESC") {
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortOption === "BPM_ASC") {
        return (a.bpm || 0) - (b.bpm || 0);
      }
      if (sortOption === "BPM_DESC") {
        return (b.bpm || 0) - (a.bpm || 0);
      }
      if (sortOption === "LEVEL_ASC" || sortOption === "LEVEL_DESC") {
        const av = LEVEL_ORDER[a.level] || 99;
        const bv = LEVEL_ORDER[b.level] || 99;
        return sortOption === "LEVEL_ASC" ? av - bv : bv - av;
      }
      return 0;
    });
  }, [songs, instrumentFilter, levelFilter, keyword, sortOption]);

  const appliedFilterCount =
    (instrumentFilter !== "ALL" ? 1 : 0) +
    (levelFilter !== "ALL" ? 1 : 0) +
    (keyword.trim() ? 1 : 0);

  if (songsQuery.isLoading) {
    return <div className="p-4">연습곡 불러오는 중...</div>;
  }

  if (songsQuery.isError) {
    return (
      <div className="p-4 text-red-500">
        연습곡을 불러오는 중 오류가 발생했습니다. <br />
        {songsQuery.error?.message}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">연습곡 목록</h1>
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
            <option value="BPM_ASC">BPM 느린순</option>
            <option value="BPM_DESC">BPM 빠른순</option>
          </select>
        </div>

        {appliedFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setInstrumentFilter("ALL");
              setLevelFilter("ALL");
              setKeyword("");
            }}
            className="ml-auto text-xs px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            필터 초기화
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        총 {processedSongs.length}개 연습곡
        {appliedFilterCount > 0 && " (필터 적용됨)"}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {processedSongs.map((song) => (
          <Link
            key={song.id || song._id}
            to={`/songs/${song.id || song._id}`}
            className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold mb-1">{song.title}</h2>
            <p className="text-sm text-gray-600 mb-1">{song.artist}</p>

            <div className="text-xs text-gray-500 mb-2">
              난이도: {song.level} · BPM: {song.bpm} · Key: {song.key || "-"}
            </div>

            <p className="text-sm text-gray-700 line-clamp-2">
              {song.description}
            </p>

            <div className="mt-2 flex flex-wrap gap-1 text-xs text-blue-600">
              {song.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 border border-blue-200 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {processedSongs.length === 0 && (
        <p className="text-sm text-gray-500">
          조건에 맞는 연습곡이 없습니다. 다른 필터를 선택해 보세요.
        </p>
      )}
    </div>
  );
}
