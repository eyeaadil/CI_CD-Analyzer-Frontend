/**
 * OAuth Callback Page
 * 
 * Handles redirect after GitHub OAuth.
 * Uses useAuth hook.
 */

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleOAuthCallback } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error) {
            navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
            return;
        }

        if (token) {
            handleOAuthCallback(token);
        } else {
            navigate("/login", { replace: true });
        }
    }, [searchParams, navigate, handleOAuthCallback]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Completing sign in...</p>
        </div>
    );
};

export default AuthCallback;
