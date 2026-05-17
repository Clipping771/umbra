import Link from "next/link";
import { Sparkles, Globe, Send, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: Send, href: "#", label: "Telegram" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F0A1E] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-8">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-white tracking-tight">
                Lavender <span className="text-violet-300 italic">Umbra</span>
              </span>
            </Link>
            <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
              Premium artisan soaps handcrafted with love and weightless air, providing a cloud-like experience.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-heading text-base font-bold mb-8 text-white uppercase tracking-widest">Collections</h4>
            <ul className="space-y-4">
              {[
                { label: "Shop All Products", href: "/shop" },
                { label: "Weightless Series", href: "/shop?type=weightless" },
                { label: "Bestsellers", href: "/shop" },
                { label: "Gift Sets", href: "/shop" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/45 text-sm hover:text-white/80 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The Brand */}
          <div>
            <h4 className="font-heading text-base font-bold mb-8 text-white uppercase tracking-widest">The Brand</h4>
            <ul className="space-y-4">
              {[
                { label: "Our Philosophy", href: "/#why-it-floats" },
                { label: "How it Floats", href: "/#float-demo" },
                { label: "Client Reviews", href: "/#reviews" },
                { label: "Ingredients Library", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/45 text-sm hover:text-white/80 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-bold mb-8 text-white uppercase tracking-widest">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-white/45 text-sm leading-relaxed">Gulshan-2, Dhaka,<br />Bangladesh</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-white/45 text-sm">hello@lavenderumbra.com</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-white/45 text-sm">+880 1712-345678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-6 text-white/25 text-xs">
          <p>© 2026 Lavender Umbra. Designed with weightless luxury in mind.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/50 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white/50 transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
