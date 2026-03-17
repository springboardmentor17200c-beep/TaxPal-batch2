import api from './api';

const getYearlyOverview = async (year) => {
    try {
        const response = await api.get(`/analytics/yearly-overview?year=${year}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getCategoryBreakdown = async (month) => {
    try {
        const response = await api.get(`/analytics/category-breakdown?month=${month}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const analyticsService = {
    getYearlyOverview,
    getCategoryBreakdown
};

export default analyticsService;
