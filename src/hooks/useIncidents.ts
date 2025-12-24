/**
 * useIncidents Hook
 * 
 * Fetches incidents (failed workflow runs with AI analysis) from the API.
 */

import { useState, useCallback, useEffect } from "react";
import { INCIDENTS, fetchAPI } from "@/lib/api";

// Types
export interface Incident {
    id: number;
    githubRunId: string;
    workflowName: string;
    branch: string;
    actor: string;
    commitSha: string;
    runUrl: string;
    createdAt: string;
    status: "active" | "resolved";
    repo: {
        name: string;
        owner: string;
        fullName: string;
    };
    analysis: {
        rootCause: string;
        failureStage: string;
        suggestedFix: string;
        priority: number;
        priorityLabel: string;
        failureType: string;
    } | null;
}

export interface IncidentStats {
    total: number;
    byPriority: {
        p0: number;
        p1: number;
        p2: number;
    };
    activeCount: number;
    last24h: number;
    last7d: number;
}

interface IncidentsState {
    incidents: Incident[];
    stats: IncidentStats | null;
    loading: boolean;
    loadingStats: boolean;
    error: string | null;
}

export function useIncidents() {
    const [state, setState] = useState<IncidentsState>({
        incidents: [],
        stats: null,
        loading: false,
        loadingStats: false,
        error: null,
    });

    /**
     * Fetch incidents list
     */
    const fetchIncidents = useCallback(async (filters?: { status?: string; priority?: number }) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            let url = INCIDENTS.LIST;
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.priority !== undefined) params.append('priority', String(filters.priority));
            if (params.toString()) url += `?${params.toString()}`;

            const data = await fetchAPI<Incident[]>(url);
            setState(prev => ({ ...prev, incidents: data, loading: false }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch incidents";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Incidents error:", err);
        }
    }, []);

    /**
     * Fetch incident stats
     */
    const fetchStats = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loadingStats: true }));
            const data = await fetchAPI<IncidentStats>(INCIDENTS.STATS);
            setState(prev => ({ ...prev, stats: data, loadingStats: false }));
        } catch (err) {
            console.error("Incident stats error:", err);
            setState(prev => ({ ...prev, loadingStats: false }));
        }
    }, []);

    /**
     * Fetch all data
     */
    const fetchAll = useCallback(async () => {
        await Promise.all([fetchIncidents(), fetchStats()]);
    }, [fetchIncidents, fetchStats]);

    /**
     * Refresh
     */
    const refresh = useCallback(() => {
        return fetchAll();
    }, [fetchAll]);

    // Fetch on mount
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Computed values
    const activeCount = state.incidents.filter(i => i.status === "active").length;
    const resolvedCount = state.incidents.filter(i => i.status === "resolved").length;
    const p0Count = state.incidents.filter(i => i.analysis?.priority === 0).length;
    const p1Count = state.incidents.filter(i => i.analysis?.priority === 1).length;

    return {
        incidents: state.incidents,
        stats: state.stats,
        loading: state.loading,
        loadingStats: state.loadingStats,
        error: state.error,
        activeCount,
        resolvedCount,
        p0Count,
        p1Count,
        fetchIncidents,
        fetchStats,
        refresh,
    };
}
