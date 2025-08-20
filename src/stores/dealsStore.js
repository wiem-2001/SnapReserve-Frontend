import { create } from 'zustand';
import axios from 'axios';

const DEALS_URL = import.meta.env.VITE_API_URL + '/deals';

const useDealsStore = create((set) => ({
  eligible:false,
  welcome_gift_expiry:null,
  loading: false,
  error: null,

  fetchScratchEligibility: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${DEALS_URL}/scratch-card-eligibility`, {
        withCredentials: true,
      });
      console.log("result eligibility",res.data.eligible);
      set({ eligible: res.data.eligible,welcome_gift_expiry:res.data.welcome_gift_expiry, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(' Failed to fetch notifications:', error);
    }
  },

  clearNotifications: () => set({ eligible: false}),
}));

export default useDealsStore;
