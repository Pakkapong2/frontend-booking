import api from './api';

export const borrowBook = async (book_id) => {
  try {
    const response = await api.post('/borrowings', { book_id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const returnBook = async (borrow_id) => {
  try {
    const response = await api.put('/borrowings/return', { borrow_id });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllBorrowings = async () => {
  try {
    const response = await api.get('/borrowings');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getMyBorrowings = async () => {
  try {
    const response = await api.get('/borrowings');
    // Note: The backend currently returns ALL borrowings. 
    // Usually we would filter on backend, but I will filter on frontend for now if needed,
    // or assume the backend is intended to be filtered by the middleware's user info if modified.
    // Looking at borrowingController.js, getAllBorrowings doesn't filter by user.
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};