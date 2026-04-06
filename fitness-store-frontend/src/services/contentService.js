import axios from 'axios';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

export const fetchContentByKey = async (key) => {
  if (!key) throw new Error('Content key is required');

  const { data } = await axios.get(`${API_BASE_URL}/content/${encodeURIComponent(key)}`);
  return data?.data?.content || null;
};
