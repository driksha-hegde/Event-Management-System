// src/services/reportService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

export const getRegistrationReport = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/registration`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching registration report', error);
    throw error;
  }
};

export const getEventPerformance = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/event-performance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event performance', error);
    throw error;
  }
};
