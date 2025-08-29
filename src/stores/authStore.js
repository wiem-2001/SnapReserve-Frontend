import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
const AuthApi = import.meta.env.VITE_API_URL+'/auth'; 


const useAuthStore = create((set) => ({
  user: null,
  token:  Cookies.get('token') ,
  loading: false,
  error: null,
  devices: [],
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

  resendVerificationEmail : async (data) => {
     set({ loading: true, error: null });
     try {
      const res = await axios.post(`${AuthApi}/resend-verification-email`, data);
      return res.data;
     }catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      throw error;
  }
},

getMe: async () => {
  set({ loading: true, error: null });
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');
    const res = await axios.get(`${AuthApi}/me`, {
      withCredentials: true
    });  
    set({ user: res.data, loading: false, token });
    return res.data;
    
  } catch (error) {
    if (error.response?.status === 401 || error.message.includes('token')) {
      Cookies.remove('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ user: null, token: null, loading: false });
    }
    set({ 
      loading: false, 
      error: error.response?.data?.message || error.message 
    });
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
      const message = error.response?.data?.message || error.message || 'Unknown error';
      set({ loading: false, error: message });
      throw message;
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
      throw error.response?.data?.message;
    }
  },

  updateImageProfil: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(`${AuthApi}/upload-profile`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        withCredentials: true,
      });

      set((state) => ({
        user: { 
          ...state.user, 
          avatar: res.data.avatarUrl,
          profile_image: res.data.image 
        },
        loading: false
      }));
      
      return res.data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
      set({ loading: true, error: null });
      try {
        const res = await axios.put(`${AuthApi}/update-profile`, profileData, { withCredentials: true });
        set({ loading: false, user: res.data.user });
        return res.data;
      } catch (error) {
        set({ loading: false, error: error.response?.data?.message || error.message });
        throw error;
      }
    },
  updatePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${AuthApi}/update-password`, {
        currentPassword,
        newPassword,
        confirmPassword
      }, { 
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      set({ loading: false });
      return { success: true, message: res.data.message || 'Password updated successfully' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ loading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

deleteUser: async () => {
  set({ loading: true, error: null });
  try {
    await axios.delete(`${AuthApi}/delete-account`, { withCredentials: true });
    Cookies.remove('token');
    localStorage.clear();
    set({ user: null, token: null, loading: false });
    return { success: true, message: 'Account deleted successfully.' };
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'Failed to delete account';

    set({ loading: false, error: errorMsg });
    throw new Error(errorMsg); 
  }
},

  fetchUserDevices : async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${AuthApi}/devices`, { withCredentials: true });
      set({ devices: res.data, loading: false });
    } catch (error) {
       set({ error: error.message, loading: false });
    }
  }

}));



export default useAuthStore;