
import axios from "axios";

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://space-pg-backend.onrender.com/api"
).replace(/\/$/, "");

const API = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
});

export default API;
