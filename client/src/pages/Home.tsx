import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, BarChart3, Shield, Zap, Users, TrendingUp, Lock } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * ComplianceOS Landing Page - High-conversion B2B SaaS
 * Features: Hero, Product Features, Testimonials, Dashboard Preview, Pricing, Auth Integration
 */

// Hero Section Component
function HeroSection() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="container relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            ✨ Trusted by 500+ enterprises
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-hero mb-6 leading-tight text-foreground"
        >
          Compliance tracking that
          <br />
          <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            actually works
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Automate compliance tracking, centralize license management, and maintain regulatory
          confidence—all in one intuitive platform built for modern enterprises.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
          {isAuthenticated ? (
            <Button size="lg" className="btn-primary">
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button size="lg" className="btn-primary" asChild>
                <a href={getLoginUrl()}>Get Started Free</a>
              </Button>
              <Button size="lg" variant="outline" className="btn-outline">
                View Demo
              </Button>
            </>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div variants={itemVariants} className="mt-12 flex justify-center gap-8 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span>SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span>99.9% Uptime SLA</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Compliance Tracking",
      description: "Monitor compliance status across all systems with automated updates and alerts.",
    },
    {
      icon: Shield,
      title: "License Management",
      description: "Centralize license tracking, renewals, and compliance documentation in one place.",
    },
    {
      icon: Zap,
      title: "Automated Reporting",
      description: "Generate audit-ready reports in seconds with customizable templates and exports.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Assign tasks, share findings, and collaborate seamlessly across departments.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-padding bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Core Features
          </Badge>
          <h2 className="text-section-title mb-4 text-foreground">
            Built for compliance professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline compliance operations and reduce risk.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <Card className="card-premium p-8 h-full hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "ComplianceOS reduced our compliance audit time by 70%. It's now our operational core.",
      author: "Sarah Chen",
      title: "Chief Compliance Officer",
      company: "TechVenture Inc.",
      avatar: "SC",
    },
    {
      quote: "The automated tracking and reporting features are game-changers for our team.",
      author: "Michael Rodriguez",
      title: "Compliance Manager",
      company: "FinServe Solutions",
      avatar: "MR",
    },
    {
      quote:
        "Best investment we made for compliance management. Highly recommend to any enterprise.",
      author: "Emily Watson",
      title: "Operations Director",
      company: "Global Industries Ltd.",
      avatar: "EW",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Social Proof
          </Badge>
          <h2 className="text-section-title mb-4 text-foreground">
            Trusted by industry leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how enterprises are transforming their compliance operations.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-premium p-8 h-full flex flex-col justify-between">
                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-sm font-semibold text-accent">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Dashboard Preview Section Component
function DashboardPreviewSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Dashboard Preview
          </Badge>
          <h2 className="text-section-title mb-4 text-foreground">
            Powerful analytics at a glance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time compliance metrics, license tracking, and actionable insights.
          </p>
        </motion.div>

        {/* Dashboard Mock */}
        <motion.div
          className="relative rounded-2xl border border-border overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-card p-8">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Compliance Dashboard</h3>
                <p className="text-muted-foreground">Last updated 2 minutes ago</p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground">
                  This Month
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Compliance Score", value: "94%", trend: "+2.5%" },
                { label: "Active Licenses", value: "847", trend: "+12" },
                { label: "Pending Reviews", value: "3", trend: "-1" },
                { label: "Risk Items", value: "2", trend: "-3" },
              ].map((metric, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-lg bg-gradient-to-br from-muted/50 to-background border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                    <span className="text-sm text-accent font-semibold">{metric.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* License Tracking Table Preview */}
            <div className="rounded-lg bg-muted/30 p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-4">License Tracking</h4>
              <div className="space-y-3">
                {[
                  { name: "Enterprise Suite", expiry: "Mar 31, 2025", status: "Active" },
                  { name: "Security Module", expiry: "Jun 15, 2025", status: "Active" },
                  { name: "Analytics Pro", expiry: "Apr 20, 2025", status: "Expiring Soon" },
                ].map((license, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{license.name}</p>
                      <p className="text-sm text-muted-foreground">Expires {license.expiry}</p>
                    </div>
                    <Badge
                      variant={license.status === "Active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {license.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Pricing Section Component
function PricingSection() {
  const { isAuthenticated } = useAuth();
  const plans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 licenses",
        "Basic compliance tracking",
        "Monthly reports",
        "Email support",
        "Custom Phone Support",
      ],
      cta: "Get Started",
      highlighted: false,
      stripeLink: "https://buy.stripe.com/test_7sY5kC5897TcdJbg8F0x200",
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      description: "For growing compliance operations",
      features: [
        "Unlimited licenses",
        "Advanced compliance tracking",
        "Real-time alerts",
        "Priority support",
        "Custom integrations",
        "Team collaboration",
        "Custom Phone Support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      stripeLink: "https://buy.stripe.com/test_3cIfZg301a1k20t6y50x201",
    },
    {
      name: "Advanced",
      price: "$299",
      period: "/month",
      description: "For large-scale operations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom workflows",
        "Advanced security",
        "SLA guarantee",
        "On-premise option",
        "Custom Phone Support",
      ],
      cta: "Get Started",
      highlighted: false,
      stripeLink: "https://buy.stripe.com/test_9B600i445ddwgVn5u10x202",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-padding bg-gradient-to-b from-muted to-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-section-title mb-4 text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your compliance needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={plan.highlighted ? "md:scale-105" : ""}
            >
              <Card
                className={`card-premium p-8 h-full flex flex-col ${
                  plan.highlighted ? "ring-2 ring-accent shadow-xl" : ""
                }`}
              >
                {plan.highlighted && (
                  <Badge className="w-fit mb-4 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted ? "btn-primary" : "btn-outline"
                  }`}
                  size="lg"
                  onClick={() => {
                    if (plan.stripeLink) {
                      window.location.href = plan.stripeLink;
                    } else if (isAuthenticated) {
                      window.location.href = '/dashboard';
                    } else {
                      window.location.href = getLoginUrl();
                    }
                  }}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="section-padding-sm bg-gradient-to-r from-accent/10 via-accent/5 to-background">
      <div className="container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-section-title mb-4 text-foreground">
            Ready to transform your compliance operations?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join 500+ enterprises using ComplianceOS to streamline their compliance workflows.
          </p>
          {!isAuthenticated && (
            <Button size="lg" className="btn-primary" asChild>
              <a href={getLoginUrl()}>
                Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Navigation Component
function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-lg text-foreground">ComplianceOS</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
              <Button size="sm" className="btn-primary" asChild>
                <a href={getLoginUrl()}>Get Started</a>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-4">
            <a href="#features" className="block text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="block text-muted-foreground hover:text-foreground">
              Pricing
            </a>
            <a href="#" className="block text-muted-foreground hover:text-foreground">
              Docs
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="font-bold text-foreground">ComplianceOS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Automated compliance tracking for modern enterprises.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 ComplianceOS. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Home Component
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <DashboardPreviewSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
