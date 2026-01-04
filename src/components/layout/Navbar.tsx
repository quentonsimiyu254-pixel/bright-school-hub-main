import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown,
  Users,
  BookOpen,
  CreditCard,
  BarChart3,
  Shield
} from "lucide-react";

const features = [
  { name: "Student Management", icon: Users, href: "#features" },
  { name: "Academic Tracking", icon: BookOpen, href: "#features" },
  { name: "Fee & Finance", icon: CreditCard, href: "#features" },
  { name: "Analytics", icon: BarChart3, href: "#features" },
  { name: "Security", icon: Shield, href: "#features" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Edu<span className="text-primary">sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <div 
              className="relative"
              onMouseEnter={() => setShowFeatures(true)}
              onMouseLeave={() => setShowFeatures(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFeatures ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFeatures && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border/50 overflow-hidden"
                  >
                    {features.map((feature) => (
                      <a
                        key={feature.name}
                        href={feature.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                      >
                        <feature.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{feature.name}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#pricing" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-card border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Features
                </p>
                {features.map((feature) => (
                  <a
                    key={feature.name}
                    href={feature.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">{feature.name}</span>
                  </a>
                ))}
              </div>
              
              <div className="border-t border-border/50 pt-4 space-y-2">
                <a href="#pricing" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                  Pricing
                </a>
                <Link to="/dashboard" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                  Demo Dashboard
                </Link>
              </div>

              <div className="border-t border-border/50 pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full">Sign In</Button>
                <Button variant="hero" className="w-full">Start Free Trial</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
