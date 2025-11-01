import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

const API_URL = `${BASE_URL}/notifications`;

export const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// 1️⃣ Get All Notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch");
    }
  }
);

// 3️⃣ Mark All as Read
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/read-all`, {}, getAuthHeader());
      return res.data.updated_count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to mark all");
    }
  }
);

// Initial State
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.is_read).length;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.is_read = true));
        state.unreadCount = 0;
      });
  },
});

// Selector to get all notifications
export const selectAllNotifications = (state) => state.notifications.notifications;

// Selector to get loading status
export const selectNotificationsLoading = (state) => state.notifications.loading;

// Selector to get error
export const selectNotificationsError = (state) => state.notifications.error;

export default notificationsSlice.reducer;




