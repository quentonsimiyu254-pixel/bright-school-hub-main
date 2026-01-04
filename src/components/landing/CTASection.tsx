import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary-glow relative overflow-hidden">
      {/* Background decorations - Elite Glassmorphism */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6"
          >
            Ready to Transform Your School with NeuroBridge?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80 mb-8"
          >
            Empower your educators with AI-driven insights for special needs education. 
            Join the global movement for inclusive learning today.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* These buttons are ready to be linked to your local Node.js routes later */}
            <Button 
              variant="accent" 
              size="xl" 
              className="group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="glass" 
              size="xl"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Specialist
            </Button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-sm text-primary-foreground/60"
          >
            Localized for your region • Secure pgAdmin Integration • Full Privacy Compliance
          </motion.p>
        </div>
      </div>
    </section>
  );
}