// import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL + "cart";

// export async function fetchCart() {
//   const res = await axios.get(`${API_URL}`);
//   return res.data.items;
// }

// export async function addToCart(productId: string, quantity: number) {
//   return axios.post(`${API_URL}/items`, { productId, quantity });
// }

// export async function updateCartItem(productId: string, quantity: number) {
//   return axios.patch(`${API_URL}/items/${productId}`, { quantity });
// }

// export async function removeFromCart(productId: string) {
//   return axios.delete(`${API_URL}/items/${productId}`);
// }

// export async function clearCartApi() {
//   return axios.delete(`${API_URL}`);
// }


// lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: false  // Not needed since you're using localStorage, not cookies
});

// This interceptor runs BEFORE every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle 401 globally (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;