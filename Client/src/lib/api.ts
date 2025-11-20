import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "cart";

export async function fetchCart() {
  const res = await axios.get(`${API_URL}`);
  return res.data.items;
}

export async function addToCart(productId: string, quantity: number) {
  return axios.post(`${API_URL}/items`, { productId, quantity });
}

export async function updateCartItem(productId: string, quantity: number) {
  return axios.patch(`${API_URL}/items/${productId}`, { quantity });
}

export async function removeFromCart(productId: string) {
  return axios.delete(`${API_URL}/items/${productId}`);
}

export async function clearCartApi() {
  return axios.delete(`${API_URL}`);
}
