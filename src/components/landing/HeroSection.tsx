import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const highlights = [
  "Offline-ready for Africa",
  "M-Pesa integrated",
  "Multi-curriculum support",
  "AI-powered insights",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Trusted by 500+ schools in Africa</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Digital School{" "}
            <span className="gradient-text">Infrastructure</span>
            <br />
            <span className="text-muted-foreground">Built for Africa</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Complete school management system that works offline, integrates M-Pesa, 
            and supports CBC, 8-4-4, IGCSE & more. Powerful yet affordable.
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            {highlights.map((highlight, index) => (
              <div
                key={highlight}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>{highlight}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" className="group">
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl" className="group">
              <Play className="w-5 h-5 text-primary" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            No credit card required • Setup in 5 minutes • Cancel anytime
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Mock Dashboard */}
            <div className="p-4 md:p-8 bg-secondary/30">
              {/* Browser bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 h-7 bg-background rounded-lg flex items-center px-3">
                  <span className="text-xs text-muted-foreground">edusphere.app/dashboard</span>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: "Total Students", value: "2,847", change: "+12%" },
                  { label: "Attendance Rate", value: "94.2%", change: "+2.3%" },
                  { label: "Fees Collected", value: "KES 4.2M", change: "+18%" },
                  { label: "Pending Tasks", value: "23", change: "-5" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                    <span className="text-xs text-success font-medium">{stat.change}</span>
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
