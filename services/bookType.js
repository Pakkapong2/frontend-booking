import api from './api';

export const getAllBookTypes = async () => {
  try {
    const response = await api.get('/booktypes');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};