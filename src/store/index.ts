/**
 * Store Index
 * 
 * Export everything from one place:
 * import { store, useAppSelector, useAppDispatch } from '@/store';
 */

export { store } from "./store";
export type { RootState, AppDispatch } from "./store";
export { useAppSelector, useAppDispatch } from "./hooks";

// Export auth slice actions
export {
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    clearAuth,
} from "./slices/authSlice";
export type { User } from "./slices/authSlice";

// Export dashboard slice actions and types
export {
    setStats,
    setRecentFailures,
    setActivity,
    setFailureCategories,
    clearDashboard,
} from "./slices/dashboardSlice";
export type {
    DashboardStats,
    RecentFailure,
    ActivityItem,
    FailureCategory,
} from "./slices/dashboardSlice";
