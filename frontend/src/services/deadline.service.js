import axios from 'axios';

const API_URL = 'http://localhost:5000/api/deadlines';

export const getDeadlines = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

export const createDeadline = async (deadlineData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, deadlineData, config);
    return response.data;
};

export const updateDeadline = async (id, deadlineData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put(`${API_URL}/${id}`, deadlineData, config);
    return response.data;
};

export const deleteDeadline = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};
