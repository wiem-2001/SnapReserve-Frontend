import { create } from 'zustand';
import axios from 'axios';

const NOTIFICATION_URL = import.meta.env.VITE_API_URL + '/notifications';

const useNotificationStore = create((set) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(NOTIFICATION_URL, {
        withCredentials: true,
      });
      set({ notifications: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(' Failed to fetch notifications:', error);
    }
  },

    markAsRead: async (notificationId) => {
    try {
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        ),
      }));
      await axios.put(`${NOTIFICATION_URL}/${notificationId}/read`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
