import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

// Generate report (PDF or CSV)
export const generateReport = async (reportData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(`${API_URL}/generate`, reportData, config);
    return response.data;
};

// Get all past reports
export const getReports = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};
