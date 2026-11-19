import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      request.url?.includes('token/refresh/')
    ) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return Promise.reject(error);

    request._retry = true;

    try {
      const { data } = await axios.post(
        `${api.defaults.baseURL}token/refresh/`,
        { refresh }
      );

      localStorage.setItem('access_token', data.access);
      request.headers.Authorization = `Bearer ${data.access}`;
      return api(request);
    } catch (refreshError) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.assign('/');
      return Promise.reject(refreshError);
    }
  }
);

export default api;