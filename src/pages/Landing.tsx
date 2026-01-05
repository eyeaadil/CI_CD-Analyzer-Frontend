import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Github,
    Zap,
    BarChart3,
    Shield,
    Clock,
    Bot,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    GitBranch,
    AlertTriangle,
    Play,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        icon: Bot,
        title: "AI-Powered Analysis",
        description: "Gemini AI analyzes your CI/CD logs to identify root causes and suggest fixes automatically.",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: Zap,
        title: "Real-Time Insights",
        description: "Get instant notifications about anomalies, patterns, and optimization opportunities.",
        color: "text-warning",
        bg: "bg-warning/10",
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        description: "Track failure trends, identify flaky tests, and monitor pipeline health across all repos.",
        color: "text-info",
        bg: "bg-info/10",
    },
    {
        icon: Shield,
        title: "Incident Management",
        description: "Automatically triages failures by priority and tracks resolution status.",
        color: "text-success",
        bg: "bg-success/10",
    },
];

const stats = [
    { value: "45hrs", label: "Dev time saved weekly" },
    { value: "98%", label: "AI accuracy rate" },
    { value: "14min", label: "Avg. fix time" },
    { value: "10k+", label: "Failures analyzed" },
];

const steps = [
    {
        step: "01",
        title: "Connect Your Repos",
        description: "Sign in with GitHub and select the repositories you want to monitor.",
        icon: Github,
    },
    {
        step: "02",
        title: "AI Analyzes Failures",
        description: "Our AI automatically processes failed builds and identifies root causes.",
        icon: Bot,
    },
    {
        step: "03",
        title: "Fix Issues Faster",
        description: "Get actionable suggestions and reduce your mean time to resolution.",
        icon: Zap,
    },
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl text-foreground">CICD.ai</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            How it Works
                        </a>
                        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild>
                            <Link to="/login">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/signup">
                                <Github className="w-4 h-4 mr-2" />
                                Get Started
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
                        Powered by Gemini AI
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                        AI-Powered
                        <br />
                        <span className="bg-gradient-to-r from-primary via-info to-primary bg-clip-text text-transparent">
                            CI/CD Failure Analysis
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Stop wasting hours debugging failed pipelines. Our AI analyzes your CI/CD logs,
                        identifies root causes, and suggests fixes in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Button size="lg" className="text-base px-8 h-12" asChild>
                            <a href="/auth/github">
                                <Github className="w-5 h-5 mr-2" />
                                Sign in with GitHub
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" className="text-base px-8 h-12">
                            <Play className="w-4 h-4 mr-2" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="text-center animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-secondary/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4">Features</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Everything you need to debug faster
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            A complete toolkit for understanding and resolving CI/CD failures.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 animate-fade-in group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4">How It Works</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Get started in 3 simple steps
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={step.step}
                                className="relative text-center animate-fade-in"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                                )}

                                <div className="relative z-10 w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                                    <step.icon className="w-7 h-7 text-primary" />
                                </div>

                                <span className="text-sm font-medium text-primary mb-2 block">{step.step}</span>
                                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted-foreground text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-info/5 p-10 text-center relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to debug faster?
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Join thousands of developers who have reduced their pipeline debugging time by 80%.
                            </p>
                            <Button size="lg" className="text-base px-8 h-12" asChild>
                                <a href="/auth/github">
                                    <Github className="w-5 h-5 mr-2" />
                                    Start Free with GitHub
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                            </Button>
                            <p className="text-xs text-muted-foreground mt-4">
                                Free tier available • No credit card required
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">CICD.ai</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="hover:text-foreground transition-colors">Docs</a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                            <Github className="w-4 h-4" />
                        </a>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        © 2024 CICD.ai. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
