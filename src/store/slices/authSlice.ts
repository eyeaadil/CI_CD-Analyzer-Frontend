/**
 * Auth Slice
 * 
 * Simple state management for authentication.
 * All logic is in the useAuth hook.
 * 
 * State:
 * - user: Current logged-in user
 * - token: JWT token
 * - loading: Loading state
 * - error: Error message
 * - isAuthenticated: Boolean check
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface User {
    id: number;
    email: string;
    name: string;
    avatarUrl?: string;
    githubUsername?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

// Initial State - check localStorage for existing token
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("auth_token"),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("auth_token"),
};

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Set user data
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        // Set token
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Set error message
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear all auth state (logout)
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            state.isAuthenticated = false;
        },
    },
});

// Export actions
export const {
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    clearAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
