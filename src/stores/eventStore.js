import { create } from 'zustand';
import axios from 'axios';
import qs from 'qs';

const EventApi = import.meta.env.VITE_API_URL + '/event'; 

const useEventStore = create((set, get) => ({
    events: [],
    event: null,
    loading: false,
    error: null,
    recommendations : [],

    fetchEvents: async (filters = {}) => {
    try {
        set({ loading: true });
        const res = await axios.get(`${EventApi}/getall-events`, {
        params: filters,
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: 'comma' }),
        });
        set({ events: res.data, loading: false });
    } catch (error) {
        set({ error: error.message, loading: false });
    }
    },


    fetchOrganizerEvents: async (filters = {}) => {
    try {
        set({ loading: true });
        const res = await axios.get(`${EventApi}/get-events/owner`, {
        params: filters,
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: 'comma' }),
        withCredentials: true, 
        });
        set({ events: res.data, loading: false });
    } catch (error) {
        set({ error: error.message, loading: false });
    }
    },

    fetchRecommendations: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${EventApi}/recommended-events`, {
        withCredentials: true,
      });
      set({ recommendations: res.data.events, loading: false });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      set({ error: error.message, loading: false });
    }
  },

    fetchEvent: async (id) => {
        try {
            set({ loading: true });
            const res = await axios.get(`${EventApi}/get-event/${id}`);
            set({ event: res.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
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
            set({ loading: true });
            await axios.delete(`${EventApi}/delete-event/${id}`, {
                withCredentials: true
            });
           
            const { fetchEvents } = get();
            await fetchEvents();
            
            set({ loading: false });
            return true;
        } catch(error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateEvent: async (id, formData) => {
      try {
        set({ loading: true });
        const res = await axios.put(`${EventApi}/edit-event/${id}`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        set({ loading: false });
        return res.data;
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    }
    
}));

export default useEventStore;