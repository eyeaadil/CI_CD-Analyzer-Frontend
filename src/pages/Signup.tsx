import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Bot, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
    "AI-powered root cause analysis",
    "Real-time failure insights",
    "Slack & webhook integrations",
    "Unlimited repositories on Pro",
];

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement signup logic
        console.log("Signup:", { name, email, password });
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background to-info/10 items-center justify-center p-12 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-info/10 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-lg">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-2xl text-foreground">CICD.ai</span>
                    </div>

                    <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
                        Free to get started
                    </Badge>

                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Stop wasting time on
                        <span className="text-primary"> failed builds</span>
                    </h2>

                    <p className="text-muted-foreground text-lg mb-8">
                        Let AI analyze your CI/CD failures and suggest fixes in seconds, not hours.
                    </p>

                    {/* Features */}
                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                                <span className="text-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Testimonial */}
                    <div className="mt-10 p-6 rounded-xl bg-card border border-border">
                        <p className="text-muted-foreground text-sm italic mb-4">
                            "CICD.ai saved our team 20+ hours per week. The AI suggestions are incredibly accurate."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                                SK
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Sarah Kim</p>
                                <p className="text-xs text-muted-foreground">Lead DevOps @ TechCorp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-2xl text-foreground">CICD.ai</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
                        <p className="text-muted-foreground">
                            Start debugging smarter in under 2 minutes
                        </p>
                    </div>

                    {/* GitHub OAuth Button */}
                    <Button
                        className="w-full h-12 text-base mb-6"
                        asChild
                    >
                        <a href="/auth/github">
                            <Github className="w-5 h-5 mr-2" />
                            Sign up with GitHub
                        </a>
                    </Button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-4 text-muted-foreground">or sign up with email</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="h-11 w-full pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Work Email
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
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="8+ characters"
                                    className="h-11 w-full pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base">
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="text-center text-xs text-muted-foreground mt-4">
                        By signing up, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
