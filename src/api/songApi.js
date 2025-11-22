import api from "./client";

export const fetchSongsByInstrument = async (instrumentId, params = {}) => {
    if (!instrumentId) {
        throw new Error("instrumentId is required");
    }

    const res = await api.get(`/instruments/${instrumentId}/songs`, { params });
    return res.data;
};
