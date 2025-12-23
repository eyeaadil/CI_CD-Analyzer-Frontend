/**
 * Dashboard Slice
 * 
 * Stores dashboard data from the API:
 * - stats: Overview metrics (success rate, failures, etc.)
 * - recentFailures: Recent failed builds
 * - activity: Activity timeline
 * - insights: AI insights (from analytics)
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ============================================
// Types
// ============================================

export interface DashboardStats {
    totalRepos: number;
    totalRuns: number;
    failedRuns24h: number;
    totalRuns24h: number;
    failureRate24h: number;
    failedRuns7d: number;
    totalRuns7d: number;
    failureRate7d: number;
    priorityDistribution: { priority: string; count: number }[];
}

export interface RecentFailure {
    id: number;
    githubRunId: string;
    workflowName: string;
    branch: string;
    actor: string;
    commitSha: string;
    runUrl: string;
    createdAt: string;
    repo: {
        name: string;
        owner: string;
        fullName: string;
    };
    analysis: {
        rootCause: string;
        failureStage: string;
        priority: string;
        failureType: string;
        suggestedFix?: string;
    } | null;
}

export interface ActivityItem {
    id: number;
    type: "failure" | "success";
    workflowName: string;
    branch: string;
    actor: string;
    status: string;
    createdAt: string;
    repo: string;
}

export interface FailureCategory {
    category: string;
    count: number;
    percentage: number;
}

interface DashboardState {
    // Data
    stats: DashboardStats | null;
    recentFailures: RecentFailure[];
    activity: ActivityItem[];
    failureCategories: FailureCategory[];

    // Loading states
    loadingStats: boolean;
    loadingRecent: boolean;
    loadingActivity: boolean;
    loadingCategories: boolean;

    // Error
    error: string | null;

    // Last fetch time (for caching)
    lastFetched: number | null;
}

// ============================================
// Initial State
// ============================================

const initialState: DashboardState = {
    stats: null,
    recentFailures: [],
    activity: [],
    failureCategories: [],

    loadingStats: false,
    loadingRecent: false,
    loadingActivity: false,
    loadingCategories: false,

    error: null,
    lastFetched: null,
};

// ============================================
// Slice
// ============================================

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        // Stats
        setStats: (state, action: PayloadAction<DashboardStats>) => {
            state.stats = action.payload;
            state.loadingStats = false;
        },
        setLoadingStats: (state, action: PayloadAction<boolean>) => {
            state.loadingStats = action.payload;
        },

        // Recent Failures
        setRecentFailures: (state, action: PayloadAction<RecentFailure[]>) => {
            state.recentFailures = action.payload;
            state.loadingRecent = false;
        },
        setLoadingRecent: (state, action: PayloadAction<boolean>) => {
            state.loadingRecent = action.payload;
        },

        // Activity
        setActivity: (state, action: PayloadAction<ActivityItem[]>) => {
            state.activity = action.payload;
            state.loadingActivity = false;
        },
        setLoadingActivity: (state, action: PayloadAction<boolean>) => {
            state.loadingActivity = action.payload;
        },

        // Failure Categories (from analytics)
        setFailureCategories: (state, action: PayloadAction<FailureCategory[]>) => {
            state.failureCategories = action.payload;
            state.loadingCategories = false;
        },
        setLoadingCategories: (state, action: PayloadAction<boolean>) => {
            state.loadingCategories = action.payload;
        },

        // Error
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },

        // Mark as fetched
        setLastFetched: (state) => {
            state.lastFetched = Date.now();
        },

        // Clear all data (on logout)
        clearDashboard: () => initialState,
    },
});

// Export actions
export const {
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
} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;
