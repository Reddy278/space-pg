import axios from "axios";

export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const API = axios.create({ baseURL: API_BASE });

export async function getRooms() {
  const response = await API.get("/rooms");
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.rooms)) return payload.rooms;
  throw new Error(payload.message || "The rooms API returned an unexpected response.");
}

export default API;
