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
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
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
      difficultyFilter,
      tagFilter,
      keyword,
    ],
    queryFn: () =>
      fetchSongs({
        instrumentId: instrumentFilter !== "ALL" ? instrumentFilter : undefined,
        difficulty: difficultyFilter !== "ALL" ? difficultyFilter : undefined,
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
      return instruments.map((instrument) => ({
        value: instrument.id,
        label: instrument.nameKo || instrument.nameEn || instrument.id,
      }));
    }

    const fallback = new Map();
    songs.forEach((song) => {
      song.sections?.forEach((section) => {
        if (!fallback.has(section.instrumentId)) {
          fallback.set(section.instrumentId, section.instrumentId);
        }
      });
    });
    return Array.from(fallback.keys()).map((value) => ({
      value,
      label: value,
    }));
  }, [instruments, songs]);

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
        const av = LEVEL_ORDER[a.difficulty] || 99;
        const bv = LEVEL_ORDER[b.difficulty] || 99;
        return sortOption === "LEVEL_ASC" ? av - bv : bv - av;
      }
      return 0;
    });
  }, [songs, sortOption]);

  const appliedFilterCount =
    (instrumentFilter !== "ALL" ? 1 : 0) +
    (difficultyFilter !== "ALL" ? 1 : 0) +
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
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
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
              setDifficultyFilter("ALL");
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
          const filteredSections =
            instrumentFilter !== "ALL"
              ? song.sections?.filter(
                  (section) => section.instrumentId === instrumentFilter
                )
              : song.sections;

          return (
            <div
              key={song.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    to={`/songs/${song.id}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {song.title}
                  </Link>
                  {song.artist && (
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  )}
                </div>
                {song.difficulty && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    난이도 {song.difficulty}
                  </span>
                )}
              </div>

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

              <div className="space-y-2">
                {filteredSections?.map((section, idx) => (
                  <div
                    key={`${section.instrumentId}-${idx}`}
                    className="border rounded-md p-2 bg-gray-50 flex items-center justify-between"
                  >
                    <div className="text-sm">
                      <div className="font-medium">
                        역할: {section.role ?? "파트"}
                      </div>
                      {section.level && (
                        <div className="text-xs text-gray-600">
                          파트 난이도: {section.level}
                        </div>
                      )}
                      {section.note && (
                        <div className="text-xs text-gray-500 mt-1">
                          {section.note}
                        </div>
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
