import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
const AuthApi = import.meta.env.VITE_API_URL+'/auth'; 


const useAuthStore = create((set) => ({
  user: null,
  token:  Cookies.get('token') ,
  loading: false,
  error: null,
  setToken: (token) => set({ token }),

  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${AuthApi}/signup`, data);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  signin: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${AuthApi}/signin`, data);
      const { token } = res.data;
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ token, loading: false });
      return token;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  getMe: async () => {
    set({ loading: true, error: null });
    try {
    const token = Cookies.get('token');
      if (!token) throw new Error('No token found');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${AuthApi}/me`);
      set({ user: res.data, loading: false, token });
      return res.data;
    } catch (error) {
      set({ loading: false, user: null, token: null, error: error.response?.data?.message || error.message });
    Cookies.remove('token');
      throw error;
    }
  },

  logout: () => {
  Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },

  
forgetPassword: async (data) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.post(`${AuthApi}/forgot-password`, data);
    set({ loading: false });
    return res.data;
  } catch (error) {
    set({ loading: false, error: error.response?.data?.message || error.message });
    throw error;
  }
},

resetPassword: async ({ userId, token, newPassword }) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.post(`${AuthApi}/reset-password`, {
      userId,
      token,
      newPassword,
    });
    set({ loading: false });
    return res.data;
  } catch (error) {
    set({ loading: false, error: error.response?.data?.message || error.message });
    throw error;
  }
},

}));


export default useAuthStore;
