import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../BaseUrl";

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found. Please log in again.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Upload Image
export const uploadImage = createAsyncThunk(
  "profile/uploadImage",
  async ({ file, type = "profile" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Get Profile + Posts
export const getPosts = createAsyncThunk(
  "profile/getPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/profile`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (updateData, thunkAPI) => {
    try {
      const res = await axios.put(`${BASE_URL}/auth/profile`, updateData, getAuthHeader());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to update profile"
      );
    }
  }
);

// Delete Post
export const DeletePost = createAsyncThunk(
  "profile/DeletePost",
  async (postId, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/posts/${postId}`, getAuthHeader());
      return { postId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to delete post"
      );
    }
  }
);

// Fetch Comments for Post
export const fetchComments = createAsyncThunk(
  "profile/fetchComments",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`, getAuthHeader());
      return { postId, comments: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    posts: null,
    uploadData: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Upload Image ===
      .addCase(uploadImage.pending, (state) => {
        state.status = "uploading";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = "uploaded";
        state.uploadData = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error?.message;
      })

      // === Get Posts ===
      .addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error?.message;
      })

      // === Update Profile ===
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "updated";
        state.posts = { ...(state.posts || {}), ...action.payload };
      })

      // === Delete Post ===
      .addCase(DeletePost.fulfilled, (state, action) => {
        if (state.posts?.recentPosts) {
          state.posts.recentPosts = state.posts.recentPosts.filter(
            (post) => post._id !== action.payload.postId
          );
        }
      })

      // === Fetch Comments ===
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        const postIndex = state.posts?.recentPosts?.findIndex((p) => p._id === postId);
        if (postIndex !== -1 && postIndex !== undefined) {
          state.posts.recentPosts[postIndex].comments = comments;
        }
      });
  },
});

export default profileSlice.reducer;
