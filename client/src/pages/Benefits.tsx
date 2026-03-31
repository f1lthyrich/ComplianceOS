import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  TrendingUp,
  Lock,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

/**
 * ComplianceOS Benefits Page - Premium positioning as compliance savior
 * Showcases how ComplianceOS solves critical compliance challenges
 */

function BenefitsPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const benefits = [
    {
      icon: AlertCircle,
      title: "Never Miss a Deadline",
      description:
        "Automated expiry alerts ensure no license or compliance requirement slips through the cracks. Stay ahead of deadlines with intelligent notifications.",
      highlight: true,
    },
    {
      icon: Shield,
      title: "Regulatory Confidence",
      description:
        "Demonstrate compliance to auditors and regulators with comprehensive audit trails, real-time status reports, and documented evidence.",
      highlight: false,
    },
    {
      icon: TrendingUp,
      title: "Measurable Compliance Score",
      description:
        "Track your compliance posture with real-time scoring. Watch your organization's compliance health improve as you complete requirements.",
      highlight: false,
    },
    {
      icon: Users,
      title: "Unified Team Collaboration",
      description:
        "Break down silos between compliance, legal, finance, and operations. Assign tasks, track progress, and maintain accountability across teams.",
      highlight: true,
    },
    {
      icon: Clock,
      title: "Reclaim Hours Every Week",
      description:
        "Eliminate manual tracking spreadsheets and email chains. Automate compliance workflows and recover time for strategic initiatives.",
      highlight: false,
    },
    {
      icon: BarChart3,
      title: "Data-Driven Decisions",
      description:
        "Generate compliance reports instantly. Identify risk patterns, prioritize high-impact improvements, and prove ROI to leadership.",
      highlight: false,
    },
  ];

  const painPoints = [
    {
      problem: "Compliance Chaos",
      before: "Scattered spreadsheets, missed deadlines, audit failures",
      after: "Centralized hub, automated alerts, audit-ready documentation",
    },
    {
      problem: "License Sprawl",
      before: "Unknown licenses, surprise renewals, budget overruns",
      after: "Complete visibility, renewal forecasting, cost optimization",
    },
    {
      problem: "Team Confusion",
      before: "Unclear responsibilities, duplicate work, accountability gaps",
      after: "Clear ownership, streamlined workflows, complete transparency",
    },
    {
      problem: "Regulatory Risk",
      before: "Uncertain compliance status, failed audits, legal exposure",
      after: "Real-time compliance tracking, audit-ready reports, peace of mind",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-lg text-foreground">ComplianceOS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="container relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Your Compliance Advantage
            </Badge>
            <h1 className="text-hero mb-6 leading-tight text-foreground">
              Compliance Made
              <br />
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                Effortless
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ComplianceOS transforms compliance from a constant source of stress into a managed,
              measurable operation. Stop fighting fires. Start building confidence.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Benefits Grid */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/50">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section-title mb-4 text-foreground">
              Why Teams Choose ComplianceOS
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six critical capabilities that make compliance your competitive advantage
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card
                    className={`card-premium p-8 h-full flex flex-col transition-all duration-300 hover:shadow-lg ${
                      benefit.highlight ? "ring-2 ring-accent/50 bg-gradient-to-br from-background to-accent/5" : ""
                    }`}
                  >
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{benefit.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section-title mb-4 text-foreground">
              From Chaos to Control
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how ComplianceOS transforms your compliance operations
            </p>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {painPoints.map((point, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="card-premium p-8">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{point.problem}</h3>
                    </div>
                    <div className="md:border-l md:border-r md:border-border md:px-8">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{point.before}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{point.after}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="section-padding bg-gradient-to-b from-background to-muted">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section-title mb-4 text-foreground">
              Proven Results
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { metric: "87%", label: "Reduction in compliance time" },
              { metric: "0", label: "Missed deadlines" },
              { metric: "100%", label: "Audit readiness" },
              { metric: "5x", label: "Faster reporting" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <Card className="card-premium p-8 h-full flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-accent mb-2">{item.metric}</div>
                  <p className="text-muted-foreground">{item.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Transform Your Compliance Operations?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start tracking compliance frameworks, managing licenses, and maintaining regulatory confidence today.
            </p>
            <Button size="lg" className="btn-primary" asChild>
              <a href="/dashboard">
                Access Your Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default BenefitsPage;
