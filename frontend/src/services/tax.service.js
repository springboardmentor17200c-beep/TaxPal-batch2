import axios from 'axios';

const API_URL = 'http://localhost:5000/api/taxes';

// Estimate tax for a region and year based on transactions
export const estimateTax = async (taxData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(`${API_URL}/estimate`, taxData, config);
    return response.data;
};

// Save estimated tax to DB
export const saveTaxEstimate = async (estimateData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(`${API_URL}/save`, estimateData, config);
    return response.data;
};

// Get all tax estimates
export const getTaxEstimates = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};
