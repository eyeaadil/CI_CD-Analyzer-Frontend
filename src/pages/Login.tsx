/**
 * Login Page
 * 
 * Supports both:
 * - GitHub OAuth
 * - Email/Password login
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Bot, Mail, Lock, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AUTH } from "@/lib/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, loading, error, isAuthenticated, resetError } = useAuth();

    // Clear error on unmount
    useEffect(() => {
        return () => resetError();
    }, [resetError]);

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ email, password });
    };

    // If already logged in, redirect happens via hook
    if (isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-2xl text-foreground">CICD.ai</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
                        <p className="text-muted-foreground">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* GitHub OAuth Button */}
                    <Button className="w-full h-12 text-base mb-6" asChild>
                        <a href={AUTH.GITHUB}>
                            <Github className="w-5 h-5 mr-2" />
                            Continue with GitHub
                        </a>
                    </Button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-4 text-muted-foreground">or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="h-11 w-full pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-11 w-full pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background to-info/10 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-info/10 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-lg text-center">
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
                        AI-Powered Analysis
                    </Badge>

                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Debug CI/CD failures
                        <span className="text-primary"> 10x faster</span>
                    </h2>

                    <p className="text-muted-foreground text-lg mb-8">
                        Join thousands of developers who save hours every week with AI-powered root cause analysis.
                    </p>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">45hrs</p>
                            <p className="text-xs text-muted-foreground">Saved weekly</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">98%</p>
                            <p className="text-xs text-muted-foreground">AI accuracy</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground">14min</p>
                            <p className="text-xs text-muted-foreground">Avg fix time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
