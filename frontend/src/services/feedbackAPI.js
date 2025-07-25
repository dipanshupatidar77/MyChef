import axios from 'axios';

export const submitFeedback = async (data) => {
  return await axios.post('/api/feedback/submit', data);
};
