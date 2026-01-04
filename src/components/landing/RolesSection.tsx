import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Crown,
  Building2,
  GraduationCap,
  Users,
  Wallet,
  Library,
  UserCircle,
} from "lucide-react";

const roles = [
  {
    icon: Crown,
    title: "Super Admin",
    description: "Manage all schools, pricing & plans, feature toggles, cross-school analytics, and system health.",
    badge: "Platform Owner",
    color: "from-accent to-warning",
  },
  {
    icon: Building2,
    title: "School Admin",
    description: "Complete school setup, staff management, academic settings, finance overview, and compliance.",
    badge: "Management",
    color: "from-primary to-primary-glow",
  },
  {
    icon: GraduationCap,
    title: "Teacher",
    description: "Classes & subjects, attendance marking, exam grading, lesson plans, and student insights.",
    badge: "Academics",
    color: "from-success to-success/70",
  },
  {
    icon: UserCircle,
    title: "Student",
    description: "Personal timetable, assignments, exam results, fee status, and academic progress tracking.",
    badge: "Learning",
    color: "from-primary-glow to-primary",
  },
  {
    icon: Users,
    title: "Parent / Guardian",
    description: "Child's progress, fee payments via M-Pesa, school messages, calendar events, and reports.",
    badge: "Family",
    color: "from-warning to-accent",
  },
  {
    icon: Wallet,
    title: "Bursar / Accountant",
    description: "Fee collection, payment tracking, staff payroll, financial reports, and audit management.",
    badge: "Finance",
    color: "from-accent to-accent/70",
  },
  {
    icon: Library,
    title: "Librarian",
    description: "Book catalog management, borrowing system, fines tracking, and inventory control.",
    badge: "Resources",
    color: "from-muted-foreground to-foreground",
  },
];

export function RolesSection() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
          >
            Role-Based Access
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Tailored Dashboards for Everyone
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Every user gets a personalized experience with exactly what they need. 
            Secure, focused, and efficient.
          </motion.p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" className="h-full group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                      {role.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
