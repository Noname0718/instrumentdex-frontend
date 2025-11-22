// src/api/client.js
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api", // ← 여기 포트/경로 백엔드랑 똑같이
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
