import { create } from 'zustand';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const useTicketStore = create((set) => ({
  loading: false,
  loadingOrder: false,
  error: null,
  sessionUrl: null,
  orderDetails: null, 
  ticketsByYear: {},
  expandedYears: new Set(),

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
      throw error
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

fetchTickets: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const { data } = await axios.get(
        `${API_BASE}/tickets/${userId}`,
        { withCredentials: true }
      );
      
      const years = Object.keys(data).map(Number).sort((a, b) => b - a);
      const newExpandedYears = new Set();
      if (years.length > 0) {
        newExpandedYears.add(years[0]);
      }
      
      set({ 
        ticketsByYear: data,
        expandedYears: newExpandedYears,
        loading: false 
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to fetch tickets';
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },

  toggleYear: (year) => {
    set((state) => {
      const newExpandedYears = new Set(state.expandedYears);
      if (newExpandedYears.has(year)) {
        newExpandedYears.delete(year);
      } else {
        newExpandedYears.add(year);
      }
      return { expandedYears: newExpandedYears };
    });
  },

  clearState: () => set({ 
    loading: false, 
    loadingOrder: false,
    error: null, 
    sessionUrl: null,
    orderDetails: null 
  })
}));



export default useTicketStore;