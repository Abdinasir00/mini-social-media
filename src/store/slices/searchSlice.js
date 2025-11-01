import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL} from "../BaseUrl";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (query = "", thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  searchResults: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default searchSlice.reducer;
