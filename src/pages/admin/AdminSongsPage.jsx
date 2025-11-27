import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/client";

const LEVEL_OPTIONS = ["BEGINNER", "EASY", "NORMAL", "HARD"];

const createEmptySongForm = () => ({
  id: "",
  title: "",
  artist: "",
  instrumentId: "",
  level: "",
  bpm: "",
  key: "",
  description: "",
  tags: "",
});

export default function AdminSongsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(() => createEmptySongForm());
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const {
    data: songs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-practice-songs"],
    queryFn: () => apiClient.get("/practice-songs").then((res) => res.data),
  });

  const {
    data: instruments = [],
    isLoading: isInstrumentLoading,
    isError: isInstrumentError,
  } = useQuery({
    queryKey: ["admin-instruments"],
    queryFn: () => apiClient.get("/instruments").then((res) => res.data),
  });

  const instrumentMap = useMemo(() => {
    const map = new Map();
    instruments.forEach((instrument) => {
      const key = instrument._id || instrument.id;
      if (key) {
        map.set(key, instrument.nameKo || instrument.nameEn || key);
      }
    });
    return map;
  }, [instruments]);

  const createMutation = useMutation({
    mutationFn: (payload) =>
      apiClient.post("/practice-songs", payload).then((res) => res.data),
    onSuccess: (createdSong) => {
      queryClient.setQueryData(["admin-practice-songs"], (prev) => {
        if (Array.isArray(prev)) {
          return [...prev, createdSong];
        }
        return [createdSong];
      });
      queryClient.invalidateQueries({ queryKey: ["admin-practice-songs"] });
      setFeedbackMessage("연습곡이 생성되었습니다.");
      handleReset();
    },
    onError: () => setFeedbackMessage("연습곡 생성에 실패했습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      apiClient.patch(`/practice-songs/${id}`, data).then((res) => res.data),
    onSuccess: (updatedSong) => {
      queryClient.setQueryData(["admin-practice-songs"], (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((song) => {
          const targetId = song._id || song.id;
          const updatedId = updatedSong._id || updatedSong.id;
          return targetId === updatedId ? updatedSong : song;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["admin-practice-songs"] });
      setFeedbackMessage("연습곡이 수정되었습니다.");
      handleReset();
    },
    onError: () => setFeedbackMessage("연습곡 수정에 실패했습니다."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/practice-songs/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["admin-practice-songs"], (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.filter((song) => (song._id || song.id) !== id);
      });
      queryClient.invalidateQueries({ queryKey: ["admin-practice-songs"] });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const deletingId = deleteMutation.variables;

  const readySongs = useMemo(
    () =>
      songs.map((song) => ({
        ...song,
        id: song._id || song.id,
      })),
    [songs],
  );

  const nextIdMap = useMemo(() => {
    const map = new Map();
    readySongs.forEach((song) => {
      const instId = song.instrumentId;
      if (!instId) return;
      const rawId = song._id || song.id || "";
      const match = rawId.match(new RegExp(`^${instId}-(\\d+)$`));
      const currentNumber = match ? parseInt(match[1], 10) : 0;
      const previous = map.get(instId) ?? 0;
      map.set(instId, Math.max(previous, currentNumber));
    });
    return map;
  }, [readySongs]);

  const generateNextId = useCallback(
    (instrumentId) => {
      if (!instrumentId) return "";
      const current = nextIdMap.get(instrumentId) ?? 0;
      return `${instrumentId}-${String(current + 1).padStart(2, "0")}`;
    },
    [nextIdMap],
  );

  useEffect(() => {
    if (isEditing) return;
    if (!formData.instrumentId) {
      if (!formData.id) return;
      setFormData((prev) => ({ ...prev, id: "" }));
      return;
    }
    const autoId = generateNextId(formData.instrumentId);
    if (formData.id === autoId) return;
    setFormData((prev) => ({ ...prev, id: autoId }));
  }, [formData.instrumentId, formData.id, generateNextId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedbackMessage("");

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const effectiveId = isEditing
      ? formData.id
      : formData.id || generateNextId(formData.instrumentId);

    const payload = {
      ...(effectiveId ? { id: effectiveId, _id: effectiveId } : {}),
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      instrumentId: formData.instrumentId,
      level: formData.level,
      bpm: formData.bpm ? Number(formData.bpm) : undefined,
      key: formData.key.trim(),
      description: formData.description.trim(),
      tags,
    };

    if (isEditing) {
      updateMutation.mutate({ id: formData.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = async (song) => {
    setIsEditing(true);
    setFeedbackMessage("");

    const targetId = song._id || song.id;
    let detail = song;

    try {
      const { data } = await apiClient.get(`/practice-songs/${targetId}`);
      detail = data;
    } catch (err) {
      console.warn("연습곡 상세 조회 실패", err);
    }

    setFormData({
      id: detail._id || detail.id || "",
      title: detail.title || "",
      artist: detail.artist || "",
      instrumentId: detail.instrumentId || "",
      level: detail.level || "",
      bpm: detail.bpm?.toString() || "",
      key: detail.key || "",
      description: detail.description || "",
      tags: Array.isArray(detail.tags) ? detail.tags.join(", ") : "",
    });
  };

  const handleDelete = (id) => {
    if (!id) return;
    if (!window.confirm("이 연습곡을 삭제할까요?")) return;
    deleteMutation.mutate(id);
  };

  const handleReset = () => {
    setIsEditing(false);
    setFormData(createEmptySongForm());
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">연습곡 관리</h1>
        <p className="text-sm text-slate-500">
          연습곡 목록과 상세 정보를 CRUD 작업으로 관리합니다.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">연습곡 리스트</h2>
          <button
            type="button"
            onClick={handleReset}
            className="ml-auto rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            새로 만들기
          </button>
        </div>

        {isLoading && (
          <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-slate-500">
            로딩 중…
          </p>
        )}

        {isError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            에러가 발생했습니다: {error?.message}
          </p>
        )}

        {!isLoading && !isError && readySongs.length === 0 && (
          <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-slate-500">
            등록된 연습곡이 없습니다. 새로 등록해 주세요.
          </p>
        )}

        {!isLoading && !isError && readySongs.length > 0 && (
          <div className="overflow-auto rounded-2xl border">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">제목</th>
                  <th className="px-4 py-3">아티스트</th>
                  <th className="px-4 py-3">악기</th>
                  <th className="px-4 py-3">레벨</th>
                  <th className="px-4 py-3">BPM</th>
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3 text-right">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {readySongs.map((song) => {
                  const rowId = song._id || song.id;
                  return (
                    <tr key={rowId}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {song.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{song.artist}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {instrumentMap.get(song.instrumentId) || song.instrumentId || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{song.level}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {song.bpm ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{song.key}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(song)}
                            className="rounded-lg border px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rowId)}
                            disabled={
                              deleteMutation.isPending && deletingId === rowId
                            }
                            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            {deleteMutation.isPending && deletingId === rowId
                              ? "삭제 중…"
                              : "삭제"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? "연습곡 정보 수정" : "새 연습곡 등록"}
          </h2>
          <p className="text-sm text-slate-500">
            악기와 난이도 등 필수 필드를 채운 뒤 저장하세요.
          </p>
        </div>

        {feedbackMessage && (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
            {feedbackMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border p-4">
          <div className="rounded-xl border border-dashed bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-700">
              {isEditing ? "현재 연습곡 ID" : "자동 생성될 연습곡 ID"}
            </p>
            <p className="font-mono text-base text-slate-900">
              {formData.id
                ? formData.id
                : formData.instrumentId
                ? "생성 중..."
                : "악기를 선택하면 자동으로 생성됩니다"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                제목 (title)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                아티스트 (artist)
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                악기 (instrumentId)
              </label>
              <select
                name="instrumentId"
                value={formData.instrumentId}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
                disabled={isInstrumentLoading}
              >
                <option value="">악기를 선택하세요</option>
                {Array.isArray(instruments) &&
                  instruments.map((instrument) => {
                    const optionId = instrument._id || instrument.id;
                    return (
                      <option key={optionId} value={optionId}>
                        {instrument.nameKo || optionId}
                      </option>
                    );
                  })}
              </select>
              {isInstrumentLoading && (
                <p className="text-xs text-slate-500">악기 목록을 불러오는 중…</p>
              )}
              {isInstrumentError && (
                <p className="text-xs text-red-600">
                  악기 목록을 불러오지 못했습니다. 새로고침 해주세요.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                난이도 (level)
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택</option>
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">BPM</label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleChange}
                min={0}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Key</label>
              <input
                type="text"
                name="key"
                value={formData.key}
                onChange={handleChange}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              설명 (description)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              태그 (콤마로 구분)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="예: 팝, 코드, 버스킹"
              className="rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting
                ? "저장 중…"
                : isEditing
                ? "연습곡 수정"
                : "연습곡 등록"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                수정 취소
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
