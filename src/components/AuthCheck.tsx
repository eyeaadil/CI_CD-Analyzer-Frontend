/**
 * Auth Check Component
 * 
 * Runs on app load to verify existing token.
 * Uses useAuth hook.
 */

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthCheck() {
    const { token, user, checkAuth } = useAuth();

    useEffect(() => {
        // If we have a token but no user, verify the token
        if (token && !user) {
            checkAuth();
        }
    }, [token, user, checkAuth]);

    // This component doesn't render anything
    return null;
}
