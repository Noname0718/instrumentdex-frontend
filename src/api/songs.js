import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const fetchSongs = async () => {
  const res = await api.get("/api/practice-songs");
  return res.data;
};

export const fetchSongById = async (id) => {
  const res = await api.get(`/api/practice-songs/${id}`);
  return res.data;
};

export const fetchSongsByInstrument = async (instrumentId) => {
  const res = await api.get("/api/practice-songs", {
    params: { instrumentId },
  });
  return res.data;
};
