import { create } from 'zustand';
import axios from 'axios';

const dashboardUrl = import.meta.env.VITE_API_URL + '/dashboard';

const useOrganizerStatsStore = create((set) => ({
  loading: false,
  error: null,
  stats: null,
  ticketBenMarking: [],
  topEvent: null,
  eventsPerformance : [],

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${dashboardUrl}/stats`,{
        withCredentials: true,
      });
      set({ stats: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch stats' });
    } finally {
      set({ loading: false });
    }
  },

  fetchticketBenMarking: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${dashboardUrl}/ticketBenchMarking`,{
        withCredentials: true,
      });
      console.log('Booking Trends:', res.data);

      set({ ticketBenMarking: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch booking trends' });
    } finally {
      set({ loading: false });
    }
  },

  fetchTopEvent: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${dashboardUrl}/topEvent`,{
        withCredentials: true,
      });
      set({ topEvent: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch top event' });
    } finally {
      set({ loading: false });
    }
  },
    fetchEventsPerformance: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${dashboardUrl}/event-performance`,{
        withCredentials: true,
      });
      set({ eventsPerformance: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch top event' });
    } finally {
      set({ loading: false });
    }
  },

}));


export default useOrganizerStatsStore;
