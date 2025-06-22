// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import url from "../../utils/url";

// google login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: googleData.token,
          email: googleData.email,
          name: googleData.name,
          avatar: googleData.avatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the response is not 2xx, reject with the error message
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      // Handle network errors or other exceptions
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Helper function to get user from token
const getUserFromToken = (token) => {
  console.log("Token:", token);
  if (!token) return null;
  console.log("Decoding token...");
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    console.log("Decoded payload:", payload);
    return payload.user || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Login successful:", data);
      
      return { ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log(data, "register data");
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // localStorage.setItem('token', data.token);
      return { ...data, user: getUserFromToken(data.token) };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${url}auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`${url}/auth/getusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Add this to your existing async thunks
export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/auth/users/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      return { userId, updates: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add these to your existing async thunks in authSlice.js

// Delete user
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      return userId; // Return the deleted user's ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/auth/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");

      return { userId, newRole };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reset user password (admin action)
export const resetUserPassword = createAsyncThunk(
  "auth/resetUserPassword",
  async ({ userId, newPassword }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${url}/auth/users/${userId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      return { userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  allUsers: [], // Add this line
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        let user = {};
        user.name = action.payload.name;
        user.email = action.payload.email;
        user.role = action.payload.role;
        state.user = user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("token");
      });

    builder
      // ... your existing cases ...

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.allUsers = state.allUsers.filter(
          (user) => user._id !== action.payload
        );
      })

      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, newRole } = action.payload;
        const user = state.allUsers.find((u) => u._id === userId);
        if (user) {
          user.role = newRole;
        }
      });

    // Update User Details
    builder
      // Add this to your extraReducers
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        const { userId, updates } = action.payload;
        state.allUsers = state.allUsers.map((user) =>
          user._id === userId ? { ...user, ...updates } : user
        );
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAllUsers = (state) => state.auth.allUsers;

// Actions
export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
