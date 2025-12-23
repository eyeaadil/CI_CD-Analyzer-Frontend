/**
 * useRepos Hook
 * 
 * Fetches repositories data from the API.
 */

import { useState, useCallback, useEffect } from "react";
import { REPOS, fetchAPI } from "@/lib/api";

// Types
export interface Repository {
    id: number;
    name: string;
    owner: string;
    fullName: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    totalRuns: number;
    failureCount7d: number;
    totalRuns7d: number;
    failureRate7d: number;
}

interface ReposState {
    repos: Repository[];
    loading: boolean;
    error: string | null;
}

export function useRepos() {
    const [state, setState] = useState<ReposState>({
        repos: [],
        loading: false,
        error: null,
    });

    /**
     * Fetch all repos
     */
    const fetchRepos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const data = await fetchAPI<Repository[]>(REPOS.LIST);
            setState(prev => ({ ...prev, repos: data, loading: false }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch repos";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Repos error:", err);
        }
    }, []);

    /**
     * Sync repos from GitHub
     */
    const syncRepos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            await fetchAPI(REPOS.SYNC, { method: "POST" });
            // Refetch after sync
            await fetchRepos();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to sync repos";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Sync error:", err);
        }
    }, [fetchRepos]);

    /**
     * Refresh
     */
    const refresh = useCallback(() => {
        return fetchRepos();
    }, [fetchRepos]);

    // Fetch on mount
    useEffect(() => {
        fetchRepos();
    }, [fetchRepos]);

    // Calculate health score (100 - failureRate)
    const getHealthScore = (repo: Repository): number => {
        if (repo.totalRuns7d === 0) return 100; // No runs = healthy (no failures)
        return Math.round(100 - repo.failureRate7d);
    };

    // Get status based on health
    const getStatus = (healthScore: number): "healthy" | "warning" | "critical" => {
        if (healthScore >= 80) return "healthy";
        if (healthScore >= 50) return "warning";
        return "critical";
    };

    return {
        repos: state.repos,
        loading: state.loading,
        error: state.error,
        fetchRepos,
        syncRepos,
        refresh,
        getHealthScore,
        getStatus,
    };
}
