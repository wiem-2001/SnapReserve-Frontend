import { create } from 'zustand';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const useTicketStore = create((set) => ({
  loading: false,
  error: null,
  sessionUrl: null,
  orderDetails: null,

  createCheckoutSession: async (checkoutData) => {
    set({ loading: true, error: null, sessionUrl: null });
    
    try {
      const response = await axios.post(
        `${API_BASE}/tickets/create-checkout-session`,
        checkoutData,
        {
          withCredentials: true,
        }
      );
      set({ 
        loading: false,
        sessionUrl: response.data.url 
      });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to create checkout session';
      
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message ||  errorMessage;
      }
      set({  loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchOrderDetails: async (sessionId) => {
    set({ loadingOrder: true, error: null });

    try {
      const res = await axios.get(`${API_BASE}/tickets/orders/${sessionId}`, {
          withCredentials: true,
        });
      set({ orderDetails: res.data, loadingOrder: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Failed to fetch order details',
        loadingOrder: false,
      });
    }
  },

  clearState: () => set({ loading: false, error: null, sessionUrl: null,orderDetails: null })
}));



export default useTicketStore;