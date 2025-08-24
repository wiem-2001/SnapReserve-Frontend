import { create } from 'zustand';
import axios from 'axios';

const DEALS_URL = import.meta.env.VITE_API_URL + '/deals';

const useDealsStore = create((set, get) => ({
  eligible: false,
  welcome_gift_expiry: null,
  pointsBalance: null,
  pointsHistory: [],
  redemptionOptions: [],
  userLevelInfo: null,
  loading: false,
  error: null,

  fetchScratchEligibility: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${DEALS_URL}/scratch-card-eligibility`, {
        withCredentials: true,
      });
      set({ 
        eligible: res.data.eligible,
        welcome_gift_expiry: res.data.welcome_gift_expiry, 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch scratch card eligibility:', error);
    }
  },

  fetchPointsBalance: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${DEALS_URL}/balance`, {
        withCredentials: true,
      });
      set({ pointsBalance: res.data.data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  fetchPointsHistory: async (page = 1, limit = 10, action = null) => {
    set({ loading: true });
    try {
      const params = { page, limit, ...(action && { action }) };
      const res = await axios.get(`${DEALS_URL}/history`, {
        params,
        withCredentials: true,
      });
      set({ 
        pointsHistory: res.data.data, 
        pagination: res.data.pagination,
        loading: false, 
        error: null 
      });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  fetchRedemptionOptions: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${DEALS_URL}/rewards`, {
        withCredentials: true,
      });
      set({ redemptionOptions: res.data.data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  redeemPoints: async (rewardId) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${DEALS_URL}/redeem/${rewardId}`, 
        {},
        { withCredentials: true }
      );
      
      await get().fetchPointsBalance();
      await get().fetchRedemptionOptions(); 
      
      set({ loading: false, error: null });
      return res.data; 
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ error: errorMsg, loading: false });
      throw new Error(errorMsg);
    }
  },
  fetchUserLevelInfo: async () => {
  set({ loading: true });
  try {
    const res = await axios.get(`${DEALS_URL}/userLevel`, {
      withCredentials: true,
    });
    set({ userLevelInfo: res.data.data, loading: false, error: null });
  } catch (error) {
    set({ error: error.response?.data?.message || error.message, loading: false });
  }
},
  clearError: () => set({ error: null }),
  clearNotifications: () => set({ eligible: false }),
}));

export default useDealsStore;