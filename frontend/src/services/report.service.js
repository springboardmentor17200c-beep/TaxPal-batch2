import api from './api';

// Generate report (PDF or CSV)
export const generateReport = async (reportData) => {
    const response = await api.post('/reports/generate', reportData);
    return response.data;
};

// Get all past reports
export const getReports = async () => {
    const response = await api.get('/reports');
    return response.data;
};
