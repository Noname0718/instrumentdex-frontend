import api from "./client";

// 악기 리스트 조회
export const fetchInstruments = async (params = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  const res = await api.get("/instruments", { params: filteredParams });
  return res.data;
};

// 악기 상세 조회
export const fetchInstrumentDetail = async (id) => {
  const res = await api.get(`/instruments/${id}`);
  return res.data;
};
