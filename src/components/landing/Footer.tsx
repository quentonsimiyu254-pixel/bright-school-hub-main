import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Demo", href: "/dashboard" },
    { name: "Changelog", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press Kit", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Community", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Data Processing", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">
                Edu<span className="text-sidebar-primary">sphere</span>
              </span>
            </Link>
            <p className="text-sm text-sidebar-foreground/60 mb-6 max-w-xs">
              Digital school infrastructure built for Africa. 
              Powerful, affordable, and works offline.
            </p>
            <div className="space-y-2 text-sm text-sidebar-foreground/60">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@edusphere.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-sidebar-foreground/60">
            © {new Date().getFullYear()} Edusphere. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-sidebar-foreground/40">
              Made with ❤️ in Kenya for Africa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
