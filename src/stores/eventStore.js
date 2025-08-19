import { create } from 'zustand';
import axios from 'axios';
import qs from 'qs';

const EventApi = import.meta.env.VITE_API_URL + '/event';

const useEventStore = create((set, get) => ({
  events: [],
  event: null,
  loading: false,
  error: null,
  recommendations: [],
  total: 0,
  favoriteEvents: [],
  page: 1,
  limit: 10,


  fetchEvents: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${EventApi}/getall-events`, {
        params: filters,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'comma' }),
      });

      set({
        events: res.data.data || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        limit: res.data.limit || 10,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  fetchOrganizerEvents: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${EventApi}/get-events/owner`, {
        params: filters,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'comma' }),
        withCredentials: true,
      });

      set({
        events: res.data.data || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        limit: res.data.limit || 10,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  fetchRecommendations: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${EventApi}/recommended-events`, {
        withCredentials: true,
      });
      set({ recommendations: res.data.events || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  fetchEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${EventApi}/get-event/${id}`);
      set({ event: res.data || null, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },


  createEvent: async (formData) => {
    try {
      const res = await axios.post(`${EventApi}/create-event`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },
 
  deleteEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${EventApi}/delete-event/${id}`, {
        withCredentials: true,
      });

    
      const { fetchEvents } = get();
      await fetchEvents();

      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  
  updateEvent: async (id, formData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${EventApi}/edit-event/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },
  fetchFavorites: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${EventApi}/get-favorite-events`, {
        withCredentials: true,
      });
      set({
        favoriteEvents: res.data || [],
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  toggleFavorite: async (eventId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `${EventApi}/toggle-favorite/${eventId}`,
        {},
        { withCredentials: true }
      );

  
      const { fetchFavorites } = get();
      await fetchFavorites();

      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },
}));

export default useEventStore;