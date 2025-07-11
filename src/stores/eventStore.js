import { create } from 'zustand';
import axios from 'axios';

const EventApi = import.meta.env.VITE_API_URL + '/event'; 

const useEventStore = create((set, get) => ({
    events: [],
    event: null,
    loading: false,
    error: null,

    fetchEvents: async (filters = {}) => {
        try {
            set({ loading: true });
            const res = await axios.get(`${EventApi}/getall-events`, { params: filters });
            set({ events: res.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchEvent: async (id) => {
        try {
            set({ loading: true });
            const res = await axios.get(`${EventApi}/get-event/${id}`, {
                withCredentials: true
            });
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