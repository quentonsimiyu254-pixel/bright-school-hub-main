import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { RolesSection } from "@/components/landing/RolesSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer"; // Ensure correct path

const Index = () => {
  return (
    <div className="min-h-screen bg-[#05070A] selection:bg-blue-500/30">
      {/* The Navbar will eventually link to your Local Node.js 
        login route (e.g., http://localhost:5000/auth/login)
      */}
      <Navbar />
      
      <main className="relative">
        {/* Adds a subtle high-end glow to the background */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />
        
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        
        {/* Since you are hosting this yourself, you can later 
            modify PricingSection to show "Local Enterprise" tiers */}
        
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;