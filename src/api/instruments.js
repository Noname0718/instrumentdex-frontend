// src/api/instruments.js
import apiClient from "./client";

export const fetchInstruments = async () => {
    const res = await apiClient.get("/instruments");
    return res.data; // 배열
};

export const fetchInstrumentDetail = async (id) => {
    const res = await apiClient.get(`/instruments/${id}`);
    return res.data; // 객체
};
