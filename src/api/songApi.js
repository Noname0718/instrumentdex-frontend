import api from "./client";

export const fetchSongs = async (params = {}) => {
    const res = await api.get("/songs", { params });
    return res.data;
};

export const fetchSongDetail = async (id) => {
    if (!id) {
        throw new Error("song id is required");
    }

    const res = await api.get(`/songs/${id}`);
    return res.data;
};

export const fetchSongsByInstrument = async (instrumentId, params = {}) => {
    if (!instrumentId) {
        throw new Error("instrumentId is required");
    }

    const res = await api.get(`/instruments/${instrumentId}/songs`, { params });
    return res.data;
};
