/**
 * API Configuration
 * 
 * All endpoints verified from backend route files.
 * Last verified: 2024-12-18
 */

// Base URL - switches between local and production
const BASE_URL = import.meta.env.DEV
    ? 'http://localhost:3001'
    : (import.meta.env.VITE_API_URL || 'https://api.cicd.ai');

// ============================================
// AUTH ROUTES (/auth)
// File: auth.routes.js
// ============================================
export const AUTH = {
    GITHUB_LOGIN: `${BASE_URL}/auth/github/login`,      // GET - GitHub OAuth login
    GITHUB: `${BASE_URL}/auth/github`,                  // GET - GitHub OAuth (backward compat)
    GITHUB_CALLBACK: `${BASE_URL}/auth/github/callback`,// GET - GitHub OAuth callback
    ME: `${BASE_URL}/auth/me`,                          // GET - Get current user
    LOGOUT: `${BASE_URL}/auth/logout`,                  // POST - Logout
};

// ============================================
// DASHBOARD ROUTES (/api/dashboard)
// File: dashboard.routes.js
// Requires: authMiddleware
// ============================================
export const DASHBOARD = {
    STATS: `${BASE_URL}/api/dashboard/stats`,           // GET - Overview metrics
    RECENT: `${BASE_URL}/api/dashboard/recent`,         // GET - Recent failed runs
    ACTIVITY: `${BASE_URL}/api/dashboard/activity`,     // GET - Activity timeline
    SEARCH: `${BASE_URL}/api/dashboard/search`,         // GET - Search repos and runs
};

// ============================================
// REPOS ROUTES (/api/repos)
// File: repo.routes.js
// Requires: authenticate
// ============================================
export const REPOS = {
    LIST: `${BASE_URL}/api/repos`,                      // GET - List all repos with stats
    GET: (id: number | string) => `${BASE_URL}/api/repos/${id}`,      // GET - Single repo with detailed stats
    RUNS: (id: number | string) => `${BASE_URL}/api/repos/${id}/runs`,// GET - Runs for a repo with filtering
    SYNC: `${BASE_URL}/api/repos/sync`,                 // POST - Sync repos from GitHub
};

// ============================================
// RUNS ROUTES (/api/runs)
// File: run.routes.js
// Requires: authenticate
// ============================================
export const RUNS = {
    GET: (id: number | string) => `${BASE_URL}/api/runs/${id}`,           // GET - Full run detail with analysis
    LOGS: (id: number | string) => `${BASE_URL}/api/runs/${id}/logs`,     // GET - Log chunks for a run
    SIMILAR: (id: number | string) => `${BASE_URL}/api/runs/${id}/similar`,// GET - Similar past failures
    ANALYSIS: (id: number | string) => `${BASE_URL}/api/runs/${id}/analysis`,// GET - Analysis (deprecated)
    BY_REPO: (repoId: number | string) => `${BASE_URL}/api/runs/repo/${repoId}`,// GET - List runs by repo (deprecated)
};

// ============================================
// ANALYTICS ROUTES (/api/analytics)
// File: analytics.routes.js
// Requires: authMiddleware
// ============================================
export const ANALYTICS = {
    TRENDS: `${BASE_URL}/api/analytics/trends`,         // GET - Failure trends over time
    CATEGORIES: `${BASE_URL}/api/analytics/categories`, // GET - Failures by category/priority
    TOP_FAILURES: `${BASE_URL}/api/analytics/top-failures`,// GET - Most common failure patterns
};

// ============================================
// INSIGHTS ROUTES (/api/insights)
// File: insights.routes.js
// Requires: authMiddleware
// ============================================
export const INSIGHTS = {
    LIST: `${BASE_URL}/api/insights`,                   // GET - List all insights
    SUMMARY: `${BASE_URL}/api/insights/summary`,        // GET - Get summary counts
};

// ============================================
// INCIDENTS ROUTES (/api/incidents)
// File: incidents.routes.js
// Requires: authMiddleware
// ============================================
export const INCIDENTS = {
    LIST: `${BASE_URL}/api/incidents`,                  // GET - List all incidents
    STATS: `${BASE_URL}/api/incidents/stats`,           // GET - Get incident statistics
    GET: (id: number | string) => `${BASE_URL}/api/incidents/${id}`,// GET - Single incident
};

// ============================================
// USER ROUTES (/api/user)
// File: user.routes.js
// Requires: authMiddleware
// ============================================
export const USER = {
    GET_SETTINGS: `${BASE_URL}/api/user/settings`,      // GET - Get user settings
    UPDATE_SETTINGS: `${BASE_URL}/api/user/settings`,   // PUT - Update user settings
};

// ============================================
// WEBHOOKS ROUTES (/api/webhooks)
// File: webhooks.routes.js
// Requires: verifyGithubSignature
// ============================================
export const WEBHOOKS = {
    GITHUB: `${BASE_URL}/api/webhooks/github`,          // POST - GitHub webhook
};

// ============================================
// ANALYZE ROUTE (standalone)
// Defined in: index.js
// ============================================
export const ANALYZE = `${BASE_URL}/api/analyze`;       // POST - Analyze raw log

// ============================================
// HELPER: Fetch with auth
// ============================================
export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// ============================================
// ALL ENDPOINTS COMBINED
// ============================================
export const API = {
    AUTH,
    DASHBOARD,
    REPOS,
    RUNS,
    ANALYTICS,
    INSIGHTS,
    INCIDENTS,
    USER,
    WEBHOOKS,
    ANALYZE,
};

export default API;
