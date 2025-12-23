/**
 * useAnalytics Hook
 * 
 * Fetches analytics data from the API.
 * 
 * Usage:
 * const { trends, categories, loading } = useAnalytics();
 */

import { useState, useCallback, useEffect } from "react";
import { ANALYTICS, fetchAPI } from "@/lib/api";

// Types
interface TrendItem {
    date: string;
    total: number;
    failures: number;
    successes: number;
    failureRate: number;
}

interface CategoryData {
    byFailureType: { type: string; count: number }[];
    byPriority: { priority: string; label: string; count: number }[];
    byStage: { stage: string; count: number }[];
}

interface TopFailure {
    pattern: string;
    count: number;
    percentage: number;
    lastSeen: string;
    repos: string[];
}

interface AnalyticsState {
    trends: TrendItem[];
    categories: CategoryData | null;
    topFailures: TopFailure[];
    loading: boolean;
    error: string | null;
}

export function useAnalytics(days: number = 7) {
    const [state, setState] = useState<AnalyticsState>({
        trends: [],
        categories: null,
        topFailures: [],
        loading: false,
        error: null,
    });

    /**
     * Fetch trends data
     */
    const fetchTrends = useCallback(async () => {
        try {
            const data = await fetchAPI<TrendItem[]>(`${ANALYTICS.TRENDS}?days=${days}`);

            console.log("Trends data:", data);
            setState(prev => ({ ...prev, trends: data }));
        } catch (err) {
            console.error("Trends error:", err);
        }
    }, [days]);

    /**
     * Fetch categories data
     */
    const fetchCategories = useCallback(async () => {
        try {
            const data = await fetchAPI<CategoryData>(`${ANALYTICS.CATEGORIES}?days=${days}`);

            console.log("Categories data:", data);
            setState(prev => ({ ...prev, categories: data }));
        } catch (err) {
            console.error("Categories error:", err);
        }
    }, [days]);

    /**
     * Fetch top failures
     */
    const fetchTopFailures = useCallback(async () => {
        try {
            const data = await fetchAPI<TopFailure[]>(`${ANALYTICS.TOP_FAILURES}?days=${days}`);
            setState(prev => ({ ...prev, topFailures: data }));
        } catch (err) {
            console.error("Top failures error:", err);
        }
    }, [days]);

    /**
     * Fetch all analytics data
     */
    const fetchAnalytics = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            await Promise.all([
                fetchTrends(),
                fetchCategories(),
                fetchTopFailures(),
            ]);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch analytics";
            setState(prev => ({ ...prev, error: message }));
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [fetchTrends, fetchCategories, fetchTopFailures]);

    /**
     * Refresh
     */
    const refresh = useCallback(() => {
        return fetchAnalytics();
    }, [fetchAnalytics]);

    // Fetch on mount
    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // Calculate summary stats from trends
    const totalBuilds = state.trends.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalFailures = state.trends.reduce((sum, t) => sum + (t.failures || 0), 0);

    // Calculate failure rate from totals (more reliable than averaging)
    const avgFailureRate = totalBuilds > 0
        ? (totalFailures / totalBuilds) * 100
        : 0;

    const stats = {
        totalBuilds,
        totalFailures,
        avgFailureRate,
    };

    return {
        // Data
        trends: state.trends,
        categories: state.categories,
        topFailures: state.topFailures,
        stats,

        // Loading
        loading: state.loading,
        error: state.error,

        // Actions
        fetchAnalytics,
        refresh,
    };
}
