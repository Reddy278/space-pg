import API from "./api";

export const getRooms = async () => {
    const response = await API.get("/rooms");

    return response.data.rooms;
}