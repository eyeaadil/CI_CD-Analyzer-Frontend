import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    Sparkles,
    Zap,
    Building2,
    ArrowLeft,
    Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface PricingTier {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    highlighted?: boolean;
    badge?: string;
    buttonText: string;
    buttonVariant: "default" | "outline";
}

const tiers: PricingTier[] = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for personal projects and getting started",
        features: [
            "Up to 3 repositories",
            "100 workflow runs/month",
            "Basic AI analysis",
            "7-day log retention",
            "Community support",
        ],
        buttonText: "Get Started Free",
        buttonVariant: "outline",
    },
    {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For growing teams who need more power",
        features: [
            "Unlimited repositories",
            "Unlimited workflow runs",
            "Advanced AI analysis",
            "30-day log retention",
            "Priority support",
            "Slack integration",
            "Custom alerts",
            "Team collaboration (up to 5)",
        ],
        highlighted: true,
        badge: "Most Popular",
        buttonText: "Start Free Trial",
        buttonVariant: "default",
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For large organizations with advanced needs",
        features: [
            "Everything in Pro",
            "Unlimited team members",
            "90-day log retention",
            "SSO/SAML authentication",
            "Dedicated support",
            "Custom integrations",
            "On-premise option",
            "SLA guarantee",
            "Advanced security",
        ],
        buttonText: "Contact Sales",
        buttonVariant: "outline",
    },
];

function PricingCard({ tier, delay }: { tier: PricingTier; delay: number }) {
    return (
        <div
            className={cn(
                "rounded-2xl p-8 transition-all duration-300 animate-fade-in relative",
                tier.highlighted
                    ? "bg-primary/5 border-2 border-primary shadow-lg shadow-primary/10 scale-105"
                    : "bg-card border border-border hover:border-primary/30"
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {tier.badge}
                </Badge>
            )}

            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.period && (
                        <span className="text-muted-foreground">{tier.period}</span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                        <Check className={cn(
                            "w-4 h-4 flex-shrink-0",
                            tier.highlighted ? "text-primary" : "text-success"
                        )} />
                        <span className="text-foreground">{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                className="w-full"
                variant={tier.buttonVariant}
                size="lg"
            >
                {tier.buttonText}
            </Button>
        </div>
    );
}

const Pricing = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-primary" />
                        <span className="font-bold text-xl text-foreground">CICD.ai</span>
                    </div>
                    <Link to="/login">
                        <Button variant="outline" size="sm">
                            <Github className="w-4 h-4 mr-2" />
                            Sign In
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge variant="secondary" className="mb-6">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Simple, transparent pricing
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Choose the plan that's right for you
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Start free and scale as you grow. All plans include AI-powered failure analysis
                        to help you ship faster with confidence.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {tiers.map((tier, index) => (
                            <PricingCard key={tier.name} tier={tier} delay={index * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-secondary/30">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "What happens when I exceed my plan limits?",
                                a: "We'll notify you when you're approaching your limits. You can upgrade at any time, or we'll pause analysis until the next billing cycle.",
                            },
                            {
                                q: "Can I cancel my subscription anytime?",
                                a: "Yes, you can cancel anytime. You'll continue to have access until the end of your billing period.",
                            },
                            {
                                q: "Do you offer discounts for startups or open source?",
                                a: "Yes! We offer 50% off for startups (under $1M funding) and free Pro plans for qualified open source projects.",
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, and for Enterprise plans, we can arrange invoicing and wire transfers.",
                            },
                        ].map((faq, index) => (
                            <div key={index} className="rounded-xl border border-border bg-card p-6">
                                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                                <p className="text-sm text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-12">
                        <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            Need a custom solution?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            Our Enterprise plan can be tailored to your organization's specific needs.
                            Get in touch with our sales team.
                        </p>
                        <Button size="lg">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-6">
                <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CICD.ai. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Pricing;
