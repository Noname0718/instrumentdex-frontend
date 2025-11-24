import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function fetchSongs(params = {}) {
  const res = await axios.get(`${API_BASE}/api/songs`, { params });
  return res.data;
}

export async function fetchSongDetail(id) {
  if (!id) {
    throw new Error("곡 ID가 필요합니다.");
  }
  const res = await axios.get(`${API_BASE}/api/songs/${id}`);
  return res.data;
}
