// src/pages/InstrumentDetailPage.jsx
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchInstrumentDetail } from "../api/instrumentApi";
import { fetchSongsByInstrument } from "../api/songs";

export default function InstrumentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["instrument", id],
        queryFn: () => fetchInstrumentDetail(id),
    });

    const instrument = data; // 백엔드 DTO 구조에 맞게 필요하면 .instrument 등으로 수정

    return (
        <div className="p-6 space-y-6">
            {/* 상단: 뒤로가기 / 제목 */}
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/instruments")}
                    className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
                >
                    ← 목록으로
                </button>
            </div>

            {isLoading && (
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 w-40 bg-gray-200 rounded" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-24 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-40 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            )}

            {isError && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md space-y-2">
                    <p className="font-semibold">악기 정보를 불러오는 중 오류가 발생했습니다.</p>
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

            {!isLoading && !isError && instrument && (
                <>
                    {/* 제목 + 영문명 */}
                    <div>
                        <h1 className="text-2xl font-bold">{instrument.nameKo}</h1>
                        {instrument.nameEn && (
                            <p className="text-sm text-gray-500">{instrument.nameEn}</p>
                        )}
                        <div className="mt-2">
                            <Link
                                to={`/songs?instrumentId=${instrument.id}`}
                                className="inline-flex items-center text-xs px-3 py-1.5 rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                이 악기의 연습곡 전체 보기 →
                            </Link>
                        </div>
                    </div>

                    {/* 좌/우 레이아웃 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* 좌: 설명/태그 */}
                        <section className="lg:col-span-2 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">악기 설명</h2>
                                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                                    {instrument.description || "설명이 아직 등록되지 않았습니다."}
                                </p>
                            </div>

                            {instrument.tags && instrument.tags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">태그</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {instrument.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 우: 기본 정보 카드 + 이미지 */}
                        <aside className="space-y-4">
                            <div className="border rounded-xl overflow-hidden bg-white">
                                <div className="aspect-video bg-gray-100">
                                    {instrument.imageUrl ? (
                                        <img
                                            src={instrument.imageUrl}
                                            alt={instrument.nameKo}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                            이미지 없음
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">계열 (Family)</span>
                                        <span className="font-medium">{instrument.family}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">난이도</span>
                                        <span className="font-medium">
                                            {instrument.difficultyLevel}
                                        </span>
                                    </div>
                                    {instrument.createdAt && (
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>등록일</span>
                                            <span>
                                                {new Date(instrument.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* 5-3. 연습곡 섹션은 아래에서 추가 */}
                    <PracticeSongSection instrumentId={instrument.id} />
                </>
            )}
        </div>
    );
}

function PracticeSongSection({ instrumentId }) {
    const { data, isLoading, isError, error, refetch } = useQuery({
        enabled: !!instrumentId,
        queryKey: ["songs", { instrumentId }],
        queryFn: () => fetchSongsByInstrument(instrumentId),
    });

    const songs = data || [];

    return (
        <section className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">이 악기 연습곡</h2>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50"
                >
                    새로고침
                </button>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {[...Array(3)].map((_, idx) => (
                        <div
                            key={idx}
                            className="border rounded-lg p-3 flex justify-between items-center animate-pulse"
                        >
                            <div className="space-y-2 w-2/3">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                            </div>
                            <div className="h-5 w-20 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {isError && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md space-y-1 text-sm">
                    <p>연습곡을 불러오는 중 오류가 발생했습니다.</p>
                    <p>{error?.message}</p>
                </div>
            )}

            {!isLoading && !isError && songs.length === 0 && (
                <p className="text-sm text-gray-500">아직 이 악기에 등록된 연습곡이 없습니다.</p>
            )}

            {!isLoading && !isError && songs.length > 0 && (
                <ul className="space-y-2">
                    {songs.map((song) => {
                        const songId = song.id || song._id;
                        return (
                            <li
                                key={songId}
                                className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white"
                            >
                                <div className="flex-1">
                                    <Link
                                        to={`/songs/${songId}`}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        {song.title}
                                    </Link>
                                    <p className="text-xs text-gray-500">
                                        {song.artist} · 난이도 {song.level}
                                    </p>
                                    {song.tags && song.tags.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                        {song.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {song.youtubeUrl && (
                                    <a
                                        href={song.youtubeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs px-3 py-1.5 rounded-md border hover:bg-gray-50"
                                    >
                                        유튜브
                                    </a>
                                )}
                                {song.sheetUrl && (
                                    <a
                                        href={song.sheetUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs px-3 py-1.5 rounded-md border hover:bg-gray-50"
                                    >
                                        악보
                                    </a>
                                )}
                            </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
