/**
 * useAuth Custom Hook
 * 
 * Provides auth state and functions for both:
 * - GitHub OAuth
 * - Email/Password authentication
 * 
 * Usage:
 * const { user, isAuthenticated, login, signup, logout } = useAuth();
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setUser,
    setToken,
    setLoading,
    setError,
    clearAuth,
    clearError,
} from "@/store/slices/authSlice";
import { AUTH } from "@/lib/api";

// Types
interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
}

interface User {
    id: number;
    email: string;
    name: string;
    username: string;
    avatarUrl?: string;
}

interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}

export function useAuth() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, token, loading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    /**
     * Login with email and password
     */
    const login = useCallback(
        async (credentials: LoginCredentials) => {
            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const response = await fetch(AUTH.LOGIN, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Login failed");
                }

                console.log("login data", data);
                // Save to localStorage and Redux
                localStorage.setItem("auth_token", data.token);
                dispatch(setToken(data.token));
                dispatch(setUser(data.user));

                // Navigate to dashboard
                navigate("/dashboard");

                return { success: true };
            } catch (err) {
                const message = err instanceof Error ? err.message : "Login failed";
                dispatch(setError(message));
                return { success: false, error: message };
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, navigate]
    );

    /**
     * Signup with name, email, password
     */
    const signup = useCallback(
        async (userData: SignupData) => {
            try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const response = await fetch(AUTH.SIGNUP, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                console.log("signup data", data);

                if (!response.ok) {
                    throw new Error(data.message || "Signup failed");
                }

                // Save to localStorage and Redux
                localStorage.setItem("auth_token", data.token);
                dispatch(setToken(data.token));
                dispatch(setUser(data.user));

                // Navigate to dashboard
                navigate("/dashboard");

                return { success: true };
            } catch (err) {
                const message = err instanceof Error ? err.message : "Signup failed";
                dispatch(setError(message));
                return { success: false, error: message };
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, navigate]
    );

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            await fetch(AUTH.LOGOUT, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).catch(() => { });
        } finally {
            localStorage.removeItem("auth_token");
            dispatch(clearAuth());
            navigate("/login");
        }
    }, [dispatch, navigate, token]);

    /**
     * Check if user is authenticated (on app load)
     */
    const checkAuth = useCallback(async () => {
        const storedToken = localStorage.getItem("auth_token");

        if (!storedToken) {
            dispatch(clearAuth());
            return false;
        }

        try {
            dispatch(setLoading(true));

            const response = await fetch(AUTH.ME, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Not authenticated");
            }

            const userData = await response.json();
            dispatch(setToken(storedToken));
            dispatch(setUser(userData));

            return true;
        } catch {
            localStorage.removeItem("auth_token");
            dispatch(clearAuth());
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    /**
     * Handle OAuth callback (save token from URL)
     */
    const handleOAuthCallback = useCallback(
        async (callbackToken: string) => {
            console.log("OAuth callback - saving token");
            localStorage.setItem("auth_token", callbackToken);
            dispatch(setToken(callbackToken));

            try {
                // Fetch user data
                const response = await fetch(AUTH.ME, {
                    headers: {
                        Authorization: `Bearer ${callbackToken}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log("OAuth callback - user data:", userData);
                    dispatch(setUser(userData));
                }
            } catch (err) {
                console.error("OAuth callback - error fetching user:", err);
            }

            // Always navigate to dashboard
            console.log("OAuth callback - navigating to dashboard");
            navigate("/dashboard", { replace: true });
        },
        [dispatch, navigate]
    );

    /**
     * Clear error message
     */
    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        // State
        user,
        token,
        loading,
        error,
        isAuthenticated,

        // Actions
        login,
        signup,
        logout,
        checkAuth,
        handleOAuthCallback,
        resetError,
    };
}
