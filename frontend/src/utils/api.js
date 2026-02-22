import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

export const getDashboard = () => api.get('/dashboard');
export const uploadFile = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const startAnalysis = (fileId) => api.post(`/analyze/${fileId}`);
export const getAnalysisStatus = (analysisId) => api.get(`/analysis/${analysisId}/status`);
export const getBRD = (brdId) => api.get(`/brd/${brdId}`);
export const getBRDInsights = (brdId) => api.get(`/brd/${brdId}/insights`);
export const getAllBRDs = () => api.get('/brds');
export const chatWithBRD = (brdId, message) => api.post(`/brd/${brdId}/chat`, { message });
