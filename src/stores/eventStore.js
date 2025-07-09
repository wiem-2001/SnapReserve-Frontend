import { create } from 'zustand';
import axios from 'axios';

const EventApi = import.meta.env.VITE_API_URL+'/event'; 

const useEventStore = create ((set)=>({
    events: [],
    event:null,
    loading: false,
    error: null,


    fetchEvents : async (filters = {}) => {
          try {
      set({ loading: true });
      const res = await axios.get(`${EventApi}/getall-events`, { params: filters });
      set({ events: res.data, loading: false });
      
    }catch (error) {
      set({ error: error.message, loading: false });
    }
    },

     fetchEvent: async (id) => {
        try {
            set({ loading: true });

            const res = await axios.get(`${EventApi}/get-event/${id}`,{
            withCredentials: true
            });

            set({ event: res.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
        }

}))

export default useEventStore;