import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("appointy_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
export const imageUrl = (p) => p ? (p.startsWith("http") ? p : `http://localhost:5000${p}`) : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80";
