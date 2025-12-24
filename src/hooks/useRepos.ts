/**
 * useRepos Hook
 * 
 * Fetches repositories data from the API.
 * Handles available repos from GitHub and synced repos.
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

export interface AvailableRepo {
    githubId: string;
    name: string;
    owner: string;
    fullName: string;
    isPrivate: boolean;
    description: string | null;
    updatedAt: string;
    alreadySynced: boolean;
}

interface ReposState {
    repos: Repository[];
    availableRepos: AvailableRepo[];
    loading: boolean;
    loadingAvailable: boolean;
    error: string | null;
}

export function useRepos() {
    const [state, setState] = useState<ReposState>({
        repos: [],
        availableRepos: [],
        loading: false,
        loadingAvailable: false,
        error: null,
    });

    /**
     * Fetch all synced repos
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
     * Fetch available repos from GitHub (for selection modal)
     */
    const fetchAvailableRepos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loadingAvailable: true, error: null }));
            const data = await fetchAPI<{ repos: AvailableRepo[]; total: number; alreadySynced: number }>(REPOS.AVAILABLE);
            setState(prev => ({ ...prev, availableRepos: data.repos, loadingAvailable: false }));
            return data.repos;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch GitHub repos";
            setState(prev => ({ ...prev, error: message, loadingAvailable: false }));
            console.error("Available repos error:", err);
            throw err;
        }
    }, []);

    /**
     * Import selected repos from GitHub
     */
    const importSelectedRepos = useCallback(async (repos: AvailableRepo[]) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            await fetchAPI(REPOS.SYNC, {
                method: "POST",
                body: JSON.stringify({ repos }),
            });
            // Refetch synced repos after import
            await fetchRepos();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to import repos";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Import repos error:", err);
            throw err;
        }
    }, [fetchRepos]);

    /**
     * Remove a repo from tracking
     */
    const removeRepo = useCallback(async (repoId: number) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            await fetchAPI(REPOS.DELETE(repoId), { method: "DELETE" });
            // Remove from local state immediately
            setState(prev => ({
                ...prev,
                repos: prev.repos.filter(r => r.id !== repoId),
                loading: false,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to remove repo";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Remove repo error:", err);
            throw err;
        }
    }, []);

    /**
     * Refresh synced repos
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
        availableRepos: state.availableRepos,
        loading: state.loading,
        loadingAvailable: state.loadingAvailable,
        error: state.error,
        fetchRepos,
        fetchAvailableRepos,
        importSelectedRepos,
        removeRepo,
        refresh,
        getHealthScore,
        getStatus,
    };
}
