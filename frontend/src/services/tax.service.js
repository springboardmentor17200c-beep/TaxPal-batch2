import api from './api';

// Estimate tax for a region and year based on transactions
export const estimateTax = async (taxData) => {
    const response = await api.post('/taxes/estimate', taxData);
    return response.data;
};

// Save estimated tax to DB
export const saveTaxEstimate = async (estimateData) => {
    const response = await api.post('/taxes/save', estimateData);
    return response.data;
};

// Get all tax estimates
export const getTaxEstimates = async () => {
    const response = await api.get('/taxes');
    return response.data;
};

// Alias for manual saves from TaxEstimator page
export const saveTaxEstimateGeneral = saveTaxEstimate;
