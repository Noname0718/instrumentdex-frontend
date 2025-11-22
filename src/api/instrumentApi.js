import api from "./client";

// 악기 리스트 조회
export const fetchInstruments = async (params = {}) => {
  const res = await api.get("/instruments", { params });
  return res.data;
};

// 악기 상세 조회
export const fetchInstrumentDetail = async (id) => {
  const res = await api.get(`/instruments/${id}`);
  return res.data;
};
