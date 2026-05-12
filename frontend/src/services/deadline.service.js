import api from './api';

export const getDeadlines = async () => {
    const response = await api.get('/deadlines');
    return response.data;
};

export const createDeadline = async (deadlineData) => {
    const response = await api.post('/deadlines', deadlineData);
    return response.data;
};

export const updateDeadline = async (id, deadlineData) => {
    const response = await api.put(`/deadlines/${id}`, deadlineData);
    return response.data;
};

export const deleteDeadline = async (id) => {
    const response = await api.delete(`/deadlines/${id}`);
    return response.data;
};
