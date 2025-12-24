/**
 * useSettings Hook
 * 
 * Fetches and updates user settings from the API.
 */

import { useState, useCallback, useEffect } from "react";
import { USER, fetchAPI, authFetch } from "@/lib/api";
import { useAppSelector } from "@/store";

// Types
export interface UserSettings {
    theme: "dark" | "light";
    emailDigest: "daily" | "weekly" | "none";
    slackWebhook: string | null;
    notifyOnFailure: boolean;
    notifyOnSuccess: boolean;
}

interface SettingsState {
    settings: UserSettings | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
}

export function useSettings() {
    const user = useAppSelector(state => state.auth.user);

    const [state, setState] = useState<SettingsState>({
        settings: null,
        loading: false,
        saving: false,
        error: null,
    });

    /**
     * Fetch user settings
     */
    const fetchSettings = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const data = await fetchAPI<UserSettings>(USER.GET_SETTINGS);
            setState(prev => ({ ...prev, settings: data, loading: false }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch settings";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Settings fetch error:", err);
        }
    }, []);

    /**
     * Update user settings
     */
    const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
        try {
            setState(prev => ({ ...prev, saving: true, error: null }));

            const response = await authFetch(USER.UPDATE_SETTINGS, {
                method: "PUT",
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update settings");
            }

            setState(prev => ({
                ...prev,
                settings: data.settings,
                saving: false,
            }));

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update settings";
            setState(prev => ({ ...prev, error: message, saving: false }));
            console.error("Settings update error:", err);
            return false;
        }
    }, []);

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings: state.settings,
        loading: state.loading,
        saving: state.saving,
        error: state.error,
        user,
        fetchSettings,
        updateSettings,
    };
}
