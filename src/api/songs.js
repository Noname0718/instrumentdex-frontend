import apiClient from "./client";

const buildParams = (params = {}) => {
  const { difficulty, level, ...rest } = params;
  const finalLevel = level ?? difficulty;

  const entries = Object.entries({
    ...rest,
    ...(finalLevel ? { level: finalLevel } : {}),
  }).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    return true;
  });

  return Object.fromEntries(entries);
};

export async function fetchSongs(params = {}) {
  const res = await apiClient.get("/practice-songs", {
    params: buildParams(params),
  });
  return res.data;
}

export async function fetchSongDetail(id) {
  if (!id) {
    throw new Error("곡 ID가 필요합니다.");
  }
  const res = await apiClient.get(`/practice-songs/${id}`);
  return res.data;
}
