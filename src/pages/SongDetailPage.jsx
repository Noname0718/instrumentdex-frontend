import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchSongDetail, fetchSongsByInstrument } from "../api/songApi";

export default function SongDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        enabled: !!id,
        queryKey: ["song", id],
        queryFn: () => fetchSongDetail(id),
    });

    const song = data;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/songs")}
                    className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
                >
                    ← 연습곡 목록으로
                </button>

                {song?.instrumentId && (
                    <Link
                        to={`/instruments/${song.instrumentId}`}
                        className="text-sm px-3 py-1.5 rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                        이 곡의 악기: {song.mainInstrument || song.instrumentName || "바로가기"}
                    </Link>
                )}
            </div>

            {isLoading && (
                <div className="space-y-4 animate-pulse">
                    <div className="h-7 w-60 bg-gray-200 rounded" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
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
                    <p className="font-semibold">연습곡 정보를 불러오지 못했어요.</p>
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

            {!isLoading && !isError && song && (
                <div className="space-y-6">
                    <header className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h1 className="text-3xl font-bold">{song.title}</h1>
                                {song.artist && (
                                    <p className="text-sm text-gray-500">{song.artist}</p>
                                )}
                            </div>
                            {song.level && (
                                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                    {song.level}
                                </span>
                            )}
                        </div>
                        {(song.mainInstrument || song.instrumentName) && (
                            <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                                메인 악기 · {song.mainInstrument || song.instrumentName}
                            </span>
                        )}
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <section className="lg:col-span-2 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">연습 포인트</h2>
                                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                                    {song.description ||
                                        song.practiceNote ||
                                        "설명이 아직 등록되지 않았습니다."}
                                </p>
                            </div>

                            {song.tags && song.tags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">태그</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {song.tags.map((tag) => (
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

                        <aside className="space-y-4">
                            <div className="border rounded-xl p-4 bg-white space-y-3">
                                <h3 className="font-semibold text-sm text-gray-500">
                                    연습 리소스
                                </h3>
                                {song.youtubeUrl ? (
                                    <a
                                        href={song.youtubeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-center text-sm px-4 py-2 rounded-md border hover:bg-gray-50"
                                    >
                                        유튜브 영상 열기
                                    </a>
                                ) : (
                                    <p className="text-xs text-gray-400">유튜브 링크 없음</p>
                                )}

                                {song.sheetUrl ? (
                                    <a
                                        href={song.sheetUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-center text-sm px-4 py-2 rounded-md border hover:bg-gray-50"
                                    >
                                        악보 내려받기
                                    </a>
                                ) : (
                                    <p className="text-xs text-gray-400">악보 링크 없음</p>
                                )}

                                {song.instrumentId && (
                                    <Link
                                        to={`/instruments/${song.instrumentId}`}
                                        className="block text-center text-sm px-4 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    >
                                        이 악기 정보 보기
                                    </Link>
                                )}
                            </div>

                            <div className="border rounded-xl p-4 bg-white text-sm space-y-2">
                                <div className="flex justify-between text-gray-500">
                                    <span>등록일</span>
                                    <span className="text-gray-800">
                                        {song.createdAt
                                            ? new Date(song.createdAt).toLocaleDateString()
                                            : "-"}
                                    </span>
                                </div>
                                {song.updatedAt && (
                                    <div className="flex justify-between text-gray-500">
                                        <span>마지막 수정</span>
                                        <span className="text-gray-800">
                                            {new Date(song.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>

                    <RelatedSongSection
                        instrumentId={song.instrumentId}
                        currentSongId={song.id}
                    />
                </div>
            )}
        </div>
    );
}

function RelatedSongSection({ instrumentId, currentSongId }) {
    const { data, isLoading, isError } = useQuery({
        enabled: !!instrumentId,
        queryKey: ["songs", "related", instrumentId],
        queryFn: () => fetchSongsByInstrument(instrumentId),
    });

    if (!instrumentId) {
        return null;
    }

    const songs = (data || []).filter((song) => song.id !== currentSongId).slice(0, 3);

    if (isLoading) {
        return (
            <section className="mt-8 space-y-2">
                <h2 className="text-lg font-semibold">같은 악기 연습곡</h2>
                <div className="flex flex-col gap-2 animate-pulse">
                    <div className="h-14 bg-gray-100 rounded-lg" />
                    <div className="h-14 bg-gray-100 rounded-lg" />
                </div>
            </section>
        );
    }

    if (isError || songs.length === 0) {
        return null;
    }

    return (
        <section className="mt-8 space-y-3">
            <h2 className="text-lg font-semibold">같은 악기 연습곡</h2>
            <div className="grid gap-3 md:grid-cols-3">
                {songs.map((song) => (
                    <Link
                        key={song.id}
                        to={`/songs/${song.id}`}
                        className="border rounded-xl p-3 text-sm hover:shadow-sm bg-white"
                    >
                        <p className="font-semibold">{song.title}</p>
                        {song.artist && (
                            <p className="text-xs text-gray-500">{song.artist}</p>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
}
