/**
 * useInsights Hook
 * 
 * Fetches AI-detected insights (anomalies, patterns, suggestions) from the API.
 */

import { useState, useCallback, useEffect } from "react";
import { INSIGHTS, fetchAPI } from "@/lib/api";

// Types
export interface Insight {
    id: string;
    type: "anomaly" | "pattern" | "suggestion" | "resolved";
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    details: string;
    confidence: number;
    repository?: string;
    time: string;
    actionable: boolean;
}

export interface InsightsSummary {
    critical: number;
    patterns: number;
    suggestions: number;
    resolved: number;
}

interface InsightsState {
    insights: Insight[];
    summary: InsightsSummary | null;
    loading: boolean;
    loadingSummary: boolean;
    error: string | null;
}

export function useInsights() {
    const [state, setState] = useState<InsightsState>({
        insights: [],
        summary: null,
        loading: false,
        loadingSummary: false,
        error: null,
    });

    /**
     * Fetch insights list
     */
    const fetchInsights = useCallback(async (filters?: { type?: string; severity?: string }) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            let url = INSIGHTS.LIST;
            const params = new URLSearchParams();
            if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
            if (filters?.severity) params.append('severity', filters.severity);
            if (params.toString()) url += `?${params.toString()}`;

            const data = await fetchAPI<Insight[]>(url);
            setState(prev => ({ ...prev, insights: data, loading: false }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch insights";
            setState(prev => ({ ...prev, error: message, loading: false }));
            console.error("Insights error:", err);
        }
    }, []);

    /**
     * Fetch insights summary
     */
    const fetchSummary = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loadingSummary: true }));
            const data = await fetchAPI<InsightsSummary>(INSIGHTS.SUMMARY);
            setState(prev => ({ ...prev, summary: data, loadingSummary: false }));
        } catch (err) {
            console.error("Insights summary error:", err);
            setState(prev => ({ ...prev, loadingSummary: false }));
        }
    }, []);

    /**
     * Fetch all data
     */
    const fetchAll = useCallback(async () => {
        await Promise.all([fetchInsights(), fetchSummary()]);
    }, [fetchInsights, fetchSummary]);

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
    const criticalCount = state.insights.filter(i => i.severity === "critical").length;
    const resolvedCount = state.insights.filter(i => i.type === "resolved").length;
    const patternCount = state.insights.filter(i => i.type === "pattern").length;
    const suggestionCount = state.insights.filter(i => i.type === "suggestion").length;

    return {
        insights: state.insights,
        summary: state.summary,
        loading: state.loading,
        loadingSummary: state.loadingSummary,
        error: state.error,
        criticalCount,
        resolvedCount,
        patternCount,
        suggestionCount,
        fetchInsights,
        fetchSummary,
        refresh,
    };
}
