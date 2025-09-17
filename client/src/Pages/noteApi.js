import axios from "axios";

const API_URL = "http://localhost:4000/api/notes";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchNotes = async () => {
    const { data } = await axios.get(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return data.note;
};

export const createNote = async (formData) => {
    const { data } = await axios.post(`${API_URL}/create`, formData, getAuthHeaders());
    return data;
};

export const updateNote = async (id, formData) => {
    const { data } = await axios.put(`${API_URL}/edit/${id}`, formData, getAuthHeaders());
    return data;
};

export const deleteNote = async (id) => {
    const { data } = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    return data;
};

export const shareNote = async (id, email) => {
    const { data } = await axios.post(`${API_URL}/share/${id}`, { email }, getAuthHeaders());
    return data;
};