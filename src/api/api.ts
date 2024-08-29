import Axios from 'axios';

const api = Axios.create({
  baseURL: import.meta.env.VITE_BLOG_API_URL,
});

export { api };
