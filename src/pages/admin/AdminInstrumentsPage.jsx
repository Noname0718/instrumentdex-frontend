import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/client";

const FAMILY_OPTIONS = ["STRING", "KEYBOARD", "WOODWIND", "BRASS", "PERCUSSION"];
const DIFFICULTY_OPTIONS = ["BEGINNER", "EASY", "NORMAL", "HARD"];

const createEmptyForm = () => ({
  id: "",
  nameKo: "",
  nameEn: "",
  family: "",
  difficultyLevel: "",
  description: "",
  imageUrl: "",
  tags: "",
});

export default function AdminInstrumentsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(() => createEmptyForm());
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const {
    data: instruments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-instruments"],
    queryFn: () => apiClient.get("/instruments").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => apiClient.post("/instruments", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-instruments"] });
      handleReset();
      setFeedbackMessage("악기가 생성되었습니다.");
    },
    onError: () => setFeedbackMessage("악기 생성에 실패했습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(`/instruments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-instruments"] });
      handleReset();
      setFeedbackMessage("악기 정보가 수정되었습니다.");
    },
    onError: () => setFeedbackMessage("악기 수정에 실패했습니다."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/instruments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-instruments"] });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const deletingId = deleteMutation.variables;

  const readyInstruments = useMemo(
    () =>
      instruments.map((instrument) => ({
        ...instrument,
        id: instrument?._id || instrument?.id,
      })),
    [instruments],
  );

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

    const payload = {
      ...(formData.id ? { id: formData.id, _id: formData.id } : {}),
      nameKo: formData.nameKo.trim(),
      nameEn: formData.nameEn.trim(),
      family: formData.family,
      difficultyLevel: formData.difficultyLevel,
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      tags,
    };

    if (isEditing) {
      updateMutation.mutate({ id: formData.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (instrument) => {
    setIsEditing(true);
    setFeedbackMessage("");
    setFormData({
      id: instrument._id || instrument.id || "",
      nameKo: instrument.nameKo || "",
      nameEn: instrument.nameEn || "",
      family: instrument.family || "",
      difficultyLevel: instrument.difficultyLevel || "",
      description: instrument.description || "",
      imageUrl: instrument.imageUrl || "",
      tags: Array.isArray(instrument.tags) ? instrument.tags.join(", ") : "",
    });
  };

  const handleDelete = (id) => {
    if (!id) return;
    if (!window.confirm("정말 이 악기를 삭제할까요?")) return;
    deleteMutation.mutate(id);
  };

  const handleReset = () => {
    setFormData(createEmptyForm());
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">악기 관리</h1>
        <p className="text-sm text-slate-500">
          목록 확인, 신규 등록, 수정, 삭제를 한 페이지에서 처리합니다.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            등록된 악기 리스트
          </h2>
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

        {!isLoading && !isError && readyInstruments.length === 0 && (
          <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-slate-500">
            등록된 악기가 없습니다. 새로 등록해 주세요.
          </p>
        )}

        {!isLoading && !isError && readyInstruments.length > 0 && (
          <div className="overflow-auto rounded-2xl border">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">한글명</th>
                  <th className="px-4 py-3">계열</th>
                  <th className="px-4 py-3">난이도</th>
                  <th className="px-4 py-3 text-right">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {readyInstruments.map((instrument) => {
                  const rowId = instrument._id || instrument.id;
                  return (
                    <tr key={rowId}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {rowId}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {instrument.nameKo}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {instrument.family}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {instrument.difficultyLevel}
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(instrument)}
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
            {isEditing ? "악기 정보 수정" : "새 악기 등록"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "수정 완료 후 자동으로 목록이 새로고침됩니다."
              : "필수 정보 입력 후 등록 버튼을 눌러 주세요."}
          </p>
        </div>

        {feedbackMessage && (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
            {feedbackMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border p-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              ID (_id)
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              readOnly={isEditing}
              placeholder="예: violin"
              className="rounded-xl border px-3 py-2 text-sm"
            />
            <p className="text-xs text-slate-500">
              이미 존재하는 데이터를 수정할 때 자동으로 채워집니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                한글명 (nameKo)
              </label>
              <input
                type="text"
                name="nameKo"
                value={formData.nameKo}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                영어명 (nameEn)
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                계열 (family)
              </label>
              <select
                name="family"
                value={formData.family}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택</option>
                {FAMILY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                난이도 (difficultyLevel)
              </label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                required
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택</option>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
              이미지 URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
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
              placeholder="예: 버스킹, 클래식, 팝"
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
                ? "악기 수정"
                : "악기 등록"}
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
