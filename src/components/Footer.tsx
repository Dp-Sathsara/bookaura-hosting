import { Link } from "react-router-dom";
import {
  Facebook, Twitter, Instagram, Github,
  Mail, Phone, MapPin, ArrowRight
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-muted/40 font-sans pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black italic text-xl">B</span>
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                BOOK<span className="text-primary">AURA</span>
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              Your ultimate destination for curated collections and literary adventures. Discover, learn, and grow with BookFlow.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Explore</h3>
            <ul className="space-y-3">
              {["Shop All", "Featured", "Best Sellers", "New Arrivals"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Support</h3>
            <ul className="space-y-3">
              {["Contact Us", "Shipping Info", "Return Policy", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link to={item === "Contact Us" ? "/contact" : "/"} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm font-bold text-muted-foreground leading-snug italic">
                  381/1 Nahalla, Rideegama,<br />Kurunegala, Sri Lanka.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="text-sm font-bold text-muted-foreground">+94 75 995 1458</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-sm font-bold text-muted-foreground">hello@bookflow.lk</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-muted/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            © 2026 BOOKAURA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" alt="PayPal" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;