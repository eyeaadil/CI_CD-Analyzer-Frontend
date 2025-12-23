/**
 * useDashboard Hook
 * 
 * Fetches and manages dashboard data.
 * Simple and clean - similar to useAuth.
 * 
 * Usage:
 * const { stats, recentFailures, loading, fetchDashboard } = useDashboard();
 */

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setStats,
    setLoadingStats,
    setRecentFailures,
    setLoadingRecent,
    setActivity,
    setLoadingActivity,
    setFailureCategories,
    setLoadingCategories,
    setError,
    clearError,
    setLastFetched,
    clearDashboard,
    type DashboardStats,
    type RecentFailure,
    type ActivityItem,
    type FailureCategory,
} from "@/store/slices/dashboardSlice";
import { DASHBOARD, ANALYTICS, fetchAPI } from "@/lib/api";

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export function useDashboard() {
    const dispatch = useAppDispatch();
    const dashboard = useAppSelector((state) => state.dashboard);

    /**
     * Fetch dashboard stats
     */
    const fetchStats = useCallback(async () => {
        try {
            dispatch(setLoadingStats(true));
            dispatch(clearError());

            const data = await fetchAPI<DashboardStats>(DASHBOARD.STATS);
            dispatch(setStats(data));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch stats";
            dispatch(setError(message));
            console.error("Dashboard stats error:", err);
        } finally {
            dispatch(setLoadingStats(false));
        }
    }, [dispatch]);

    /**
     * Fetch recent failures
     */
    const fetchRecentFailures = useCallback(async (limit = 10) => {
        try {
            dispatch(setLoadingRecent(true));
            dispatch(clearError());

            const data = await fetchAPI<RecentFailure[]>(`${DASHBOARD.RECENT}?limit=${limit}`);
            dispatch(setRecentFailures(data));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch recent failures";
            dispatch(setError(message));
            console.error("Recent failures error:", err);
        } finally {
            dispatch(setLoadingRecent(false));
        }
    }, [dispatch]);

    /**
     * Fetch activity timeline
     */
    const fetchActivity = useCallback(async (limit = 20) => {
        try {
            dispatch(setLoadingActivity(true));
            dispatch(clearError());

            const data = await fetchAPI<ActivityItem[]>(`${DASHBOARD.ACTIVITY}?limit=${limit}`);
            dispatch(setActivity(data));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch activity";
            dispatch(setError(message));
            console.error("Activity error:", err);
        } finally {
            dispatch(setLoadingActivity(false));
        }
    }, [dispatch]);

    /**
     * Fetch failure categories (from analytics)
     */
    const fetchFailureCategories = useCallback(async () => {
        try {
            dispatch(setLoadingCategories(true));
            dispatch(clearError());

            // API returns { byFailureType, byPriority, byStage }
            interface AnalyticsResponse {
                byFailureType: { type: string; count: number }[];
                byPriority: { priority: string; count: number }[];
                byStage: { stage: string; count: number }[];
            }

            const data = await fetchAPI<AnalyticsResponse>(ANALYTICS.CATEGORIES);

            // Use byStage since failureType is often null in DB
            // Fall back to byFailureType if byStage is empty
            const stageTotal = data.byStage.reduce((sum, item) => sum + item.count, 0);
            const typeTotal = data.byFailureType.reduce((sum, item) => sum + item.count, 0);

            let categories: FailureCategory[];
            if (stageTotal > 0) {
                categories = data.byStage.map(item => ({
                    category: item.stage || "Unknown",
                    count: item.count,
                    percentage: stageTotal > 0 ? Math.round((item.count / stageTotal) * 100) : 0,
                }));
            } else {
                categories = data.byFailureType.map(item => ({
                    category: item.type || "Unknown",
                    count: item.count,
                    percentage: typeTotal > 0 ? Math.round((item.count / typeTotal) * 100) : 0,
                }));
            }

            dispatch(setFailureCategories(categories));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch categories";
            dispatch(setError(message));
            console.error("Categories error:", err);
        } finally {
            dispatch(setLoadingCategories(false));
        }
    }, [dispatch]);

    /**
     * Fetch ALL dashboard data at once
     * (Use this when loading the dashboard page)
     */
    const fetchDashboard = useCallback(async (force = false) => {
        // Skip if data was fetched recently (within cache duration)
        if (!force && dashboard.lastFetched) {
            const timeSinceLastFetch = Date.now() - dashboard.lastFetched;
            if (timeSinceLastFetch < CACHE_DURATION) {
                console.log("Using cached dashboard data");
                return;
            }
        }

        // Fetch all data in parallel
        await Promise.all([
            fetchStats(),
            fetchRecentFailures(),
            fetchActivity(),
            fetchFailureCategories(),
        ]);

        dispatch(setLastFetched());
    }, [dispatch, dashboard.lastFetched, fetchStats, fetchRecentFailures, fetchActivity, fetchFailureCategories]);

    /**
     * Refresh dashboard data
     */
    const refresh = useCallback(() => {
        return fetchDashboard(true);
    }, [fetchDashboard]);

    /**
     * Clear dashboard data (call on logout)
     */
    const clear = useCallback(() => {
        dispatch(clearDashboard());
    }, [dispatch]);

    // Check if any data is loading
    console.log("dashboard", dashboard);
    const isLoading = dashboard.loadingStats ||
        dashboard.loadingRecent ||
        dashboard.loadingActivity ||
        dashboard.loadingCategories;

    return {
        // Data
        stats: dashboard.stats,
        recentFailures: dashboard.recentFailures,
        activity: dashboard.activity,
        failureCategories: dashboard.failureCategories,

        // Loading states
        loading: isLoading,
        loadingStats: dashboard.loadingStats,
        loadingRecent: dashboard.loadingRecent,
        loadingActivity: dashboard.loadingActivity,
        loadingCategories: dashboard.loadingCategories,

        // Error
        error: dashboard.error,

        // Actions
        fetchDashboard,
        fetchStats,
        fetchRecentFailures,
        fetchActivity,
        fetchFailureCategories,
        refresh,
        clear,
    };
}
