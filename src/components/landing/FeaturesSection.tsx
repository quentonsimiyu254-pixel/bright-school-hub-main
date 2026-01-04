import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  CreditCard,
  BarChart3,
  Bell,
  Shield,
  Wifi,
  Smartphone,
  Calendar,
  FileText,
  Bus,
  Library,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student & Staff Management",
    description: "Complete profiles, admissions, enrollment tracking, and staff management with role-based access.",
    color: "from-primary to-primary-glow",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Support for CBC, 8-4-4, IGCSE, IB curricula. Lesson planning, timetables, and scheme of work.",
    color: "from-success to-success/70",
  },
  {
    icon: CreditCard,
    title: "Fees & Finance",
    description: "M-Pesa STK Push, bank payments, installments, auto-receipts, and comprehensive reports.",
    color: "from-accent to-accent/70",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Performance trends, attendance patterns, fee collection insights, and AI-powered predictions.",
    color: "from-primary to-accent",
  },
  {
    icon: FileText,
    title: "Exams & Grading",
    description: "Flexible exam setup, auto-grading, continuous assessment, beautiful report cards, and transcripts.",
    color: "from-warning to-warning/70",
  },
  {
    icon: Calendar,
    title: "Attendance System",
    description: "Daily & class attendance, QR/RFID support, late tracking, offline sync, and analytics.",
    color: "from-destructive/80 to-destructive/50",
  },
  {
    icon: Bell,
    title: "Communication Hub",
    description: "In-app messaging, SMS, email, push notifications, broadcast messages, and emergency alerts.",
    color: "from-primary-glow to-primary",
  },
  {
    icon: Smartphone,
    title: "Parent Portal",
    description: "Real-time updates, fee payments, academic progress, behavior reports, and direct messaging.",
    color: "from-success/80 to-success/50",
  },
  {
    icon: Wifi,
    title: "Offline-First",
    description: "Works without internet. Sync when online. SMS fallback notifications. Built for African reality.",
    color: "from-accent/80 to-accent/50",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access, 2FA, encryption, audit trails, GDPR compliance, and automatic backups.",
    color: "from-foreground to-muted-foreground",
  },
  {
    icon: Library,
    title: "Library & Inventory",
    description: "Book catalog, borrowing system, fines, asset tracking, stock alerts, and maintenance logs.",
    color: "from-primary to-success",
  },
  {
    icon: Bus,
    title: "Transport Management",
    description: "Bus routes, driver profiles, student pickup points, fuel logs, and vehicle maintenance.",
    color: "from-warning to-accent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Complete Solution
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Everything Your School Needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            From student enrollment to graduation, Edusphere handles every aspect 
            of school management with world-class features.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card variant="feature" className="h-full group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
