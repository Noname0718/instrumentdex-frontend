// src/pages/InstrumentsPage.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchInstruments } from "../api/instrumentApi";
import { Link } from "react-router-dom";

const FAMILY_OPTIONS = [
    { value: "", label: "전체" },
    { value: "STRING", label: "현악기 (STRING)" },
    { value: "KEYBOARD", label: "건반악기 (KEYBOARD)" },
    { value: "WOODWIND", label: "목관악기 (WOODWIND)" },
    { value: "BRASS", label: "금관악기 (BRASS)" },
    { value: "PERCUSSION", label: "타악기 (PERCUSSION)" },
];

const DIFFICULTY_OPTIONS = [
    { value: "", label: "전체" },
    { value: "BEGINNER", label: "입문 (BEGINNER)" },
    { value: "EASY", label: "쉬움 (EASY)" },
    { value: "NORMAL", label: "보통 (NORMAL)" },
    { value: "HARD", label: "어려움 (HARD)" },
];

export default function InstrumentsPage() {
    const [family, setFamily] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["instruments", { family, difficulty }],
        queryFn: () => fetchInstruments({ family, difficulty }),
    });

    const instruments = data || [];

    return (
        <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">악기 도감</h1>
                    <Link
                        to="/"
                        className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
                    >
                        홈으로
                    </Link>
                </div>
                <span className="text-sm text-gray-500">
                    총 {instruments.length}개 악기
                    {isFetching && " (새로고침 중...)"}
                </span>
            </div>

            {/* 필터 영역 */}
            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">계열 (Family)</label>
                    <select
                        className="border rounded-md px-3 py-2 text-sm"
                        value={family}
                        onChange={(e) => setFamily(e.target.value)}
                    >
                        {FAMILY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">난이도</label>
                    <select
                        className="border rounded-md px-3 py-2 text-sm"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        {DIFFICULTY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setFamily("");
                        setDifficulty("");
                    }}
                    className="ml-auto text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
                >
                    필터 초기화
                </button>
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="border rounded-xl p-4 animate-pulse flex flex-col gap-3"
                        >
                            <div className="bg-gray-200 h-32 rounded-lg" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="flex gap-2">
                                <div className="h-5 bg-gray-200 rounded w-16" />
                                <div className="h-5 bg-gray-200 rounded w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 에러 상태 */}
            {isError && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md space-y-2">
                    <p className="font-semibold">데이터를 불러오는 중 오류가 발생했습니다.</p>
                    <p className="text-sm">{error?.message}</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-1 inline-flex text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        다시 시도
                    </button>
                </div>
            )}

            {/* 빈 목록 상태 */}
            {!isLoading && !isError && instruments.length === 0 && (
                <div className="border border-dashed rounded-lg p-6 text-center text-gray-500">
                    현재 조건에 맞는 악기가 없습니다.
                    <br />
                    관리자 페이지에서 악기를 등록해 주세요.
                </div>
            )}

            {/* 정상 목록 */}
            {!isLoading && !isError && instruments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {instruments.map((instrument) => (
                        <Link
                            key={instrument.id}
                            to={`/instruments/${instrument.id}`}
                            className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col"
                        >
                            {/* 이미지 영역 */}
                            <div className="aspect-video bg-gray-100 overflow-hidden">
                                {instrument.imageUrl ? (
                                    <img
                                        src={instrument.imageUrl}
                                        alt={instrument.nameKo}
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                        이미지 없음
                                    </div>
                                )}
                            </div>

                            {/* 텍스트 영역 */}
                            <div className="p-4 flex-1 flex flex-col gap-2">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {instrument.nameKo}
                                    </h2>
                                    {instrument.nameEn && (
                                        <p className="text-xs text-gray-500">
                                            {instrument.nameEn}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs mt-1">
                                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                                        {instrument.family}
                                    </span>
                                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                        {instrument.difficultyLevel}
                                    </span>
                                </div>

                                {instrument.tags && instrument.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {instrument.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
