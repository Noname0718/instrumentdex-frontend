import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSongs } from "../api/songApi";
import { fetchInstruments } from "../api/instrumentApi";

const LEVEL_OPTIONS = [
    { value: "", label: "난이도 전체" },
    { value: "BEGINNER", label: "입문 (BEGINNER)" },
    { value: "EASY", label: "쉬움 (EASY)" },
    { value: "NORMAL", label: "보통 (NORMAL)" },
    { value: "HARD", label: "어려움 (HARD)" },
];

export default function SongsPage() {
    const [keyword, setKeyword] = useState("");
    const [keywordInput, setKeywordInput] = useState("");
    const [instrumentId, setInstrumentId] = useState("");
    const [level, setLevel] = useState("");

    const { data: instrumentOptions } = useQuery({
        queryKey: ["instruments", "for-song-filter"],
        queryFn: () => fetchInstruments(),
        staleTime: 1000 * 60 * 3,
    });

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["songs", { keyword, instrumentId, level }],
        queryFn: () =>
            fetchSongs({
                keyword: keyword || undefined,
                instrumentId: instrumentId || undefined,
                level: level || undefined,
            }),
    });

    const songs = data || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        setKeyword(keywordInput.trim());
    };

    const handleReset = () => {
        setKeyword("");
        setKeywordInput("");
        setInstrumentId("");
        setLevel("");
    };

    return (
        <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">연습곡 모음</h1>
                <span className="text-sm text-gray-500">
                    총 {songs.length}개 곡
                    {isFetching && " (불러오는 중...)"}
                </span>
            </div>

            {/* 필터 */}
            <form
                onSubmit={handleSubmit}
                className="grid gap-4 md:grid-cols-4 bg-white rounded-xl p-4 border"
            >
                <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-gray-500">검색 (제목/아티스트)</label>
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="예: Stand By Me"
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">악기</label>
                    <select
                        className="border rounded-md px-3 py-2 text-sm"
                        value={instrumentId}
                        onChange={(e) => setInstrumentId(e.target.value)}
                    >
                        <option value="">전체 악기</option>
                        {instrumentOptions?.map((instrument) => (
                            <option key={instrument.id} value={instrument.id}>
                                {instrument.nameKo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">난이도</label>
                    <select
                        className="border rounded-md px-3 py-2 text-sm"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        {LEVEL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-4 flex flex-wrap gap-2 justify-end">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-sm px-4 py-2 rounded-md border hover:bg-gray-50"
                    >
                        초기화
                    </button>
                    <button
                        type="submit"
                        className="text-sm px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
                    >
                        검색
                    </button>
                </div>
            </form>

            {/* 로딩 */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="border rounded-xl p-4 bg-white animate-pulse space-y-3"
                        >
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-gray-200 rounded" />
                                <div className="h-5 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 에러 */}
            {isError && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md space-y-2">
                    <p className="font-semibold">연습곡을 불러오는 중 오류가 발생했습니다.</p>
                    <p className="text-sm">{error?.message}</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="inline-flex text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        다시 시도
                    </button>
                </div>
            )}

            {/* 빈 상태 */}
            {!isLoading && !isError && songs.length === 0 && (
                <div className="border border-dashed rounded-lg p-6 text-center text-gray-500">
                    조건에 맞는 연습곡이 없습니다.
                    <br />
                    필터를 조정하거나 다른 키워드를 검색해 보세요.
                </div>
            )}

            {/* 리스트 */}
            {!isLoading && !isError && songs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {songs.map((song) => (
                        <Link
                            key={song.id}
                            to={`/songs/${song.id}`}
                            className="group border rounded-xl p-4 bg-white hover:shadow-md transition-shadow flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-lg font-semibold group-hover:text-blue-600">
                                        {song.title}
                                    </p>
                                    {song.artist && (
                                        <p className="text-sm text-gray-500">{song.artist}</p>
                                    )}
                                </div>
                                {song.level && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                        {song.level}
                                    </span>
                                )}
                            </div>

                            {(song.mainInstrument || song.instrumentName) && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 w-fit">
                                    {song.mainInstrument || song.instrumentName}
                                </span>
                            )}

                            {song.tags && song.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {song.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 text-xs text-gray-500">
                                {song.youtubeUrl && (
                                    <span className="px-2 py-1 rounded-md border border-dashed">
                                        유튜브
                                    </span>
                                )}
                                {song.sheetUrl && (
                                    <span className="px-2 py-1 rounded-md border border-dashed">
                                        악보
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
