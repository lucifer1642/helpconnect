import { Heart, Activity, Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 bg-background pt-16 pb-8 overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">HelpConnect</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              The real-time blood coordination network for India. We connect donors with those in critical need, eliminating delays and saving lives every day.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <SocialIcon icon={<Twitter className="w-4 h-4" />} />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} />
              <SocialIcon icon={<Github className="w-4 h-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/request-blood" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Request Blood</Link></li>
              <li><Link to="/donor-registration" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Become a Donor</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Hospital Portal</Link></li>
              <li><Link to="/status-tracking" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Live Status</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>LPU, Punjab, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@helpconnect.in</span>
              </li>
            </ul>
          </div>

          {/* Mission Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Our Mission</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To build a technology-driven emergency response network that ensures no life is lost due to unavailability of blood in India.
            </p>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Emergency Hotline</p>
              <p className="text-lg font-black text-foreground">1800-BLOOD-HELP</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            © {currentYear} HelpConnect. Crafted with <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><Heart className="h-4 w-4 text-rose-500 fill-current" /></motion.div> for India.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all transform hover:scale-110">
      {icon}
    </a>
  );
}
