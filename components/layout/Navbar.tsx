"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Philosophy", href: "/#why-it-floats" },
  { label: "Reviews", href: "/#reviews" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const pathname = usePathname();

  // Hero pages start with a dark background — navbar text should be white until scrolled
  const isHeroPage = pathname === "/";
  const isDark = isHeroPage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isDark ? "text-white/90" : "text-foreground";
  const mutedColor = isDark ? "text-white/60" : "text-muted-foreground";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-secondary/60";
  const hoverText = isDark ? "hover:text-white" : "hover:text-foreground";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-sm py-3"
            : isHeroPage
            ? "bg-transparent py-5"
            : "bg-background/80 backdrop-blur-xl border-b border-border/40 py-3 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-heading font-bold tracking-tight transition-colors duration-300 ${textColor}`}>
              Lavender{" "}
              <span className={isDark ? "text-violet-300 italic" : "gradient-text italic"}>
                Umbra
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${mutedColor} ${hoverText} ${hoverBg}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative">
              <button className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${mutedColor} ${hoverText} ${hoverBg}`}>
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 gradient-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Link>

            <Link href="/shop">
              <button className="hidden md:flex items-center gap-2 gradient-primary !text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-glow hover:scale-105 transition-all duration-300">
                Shop Now
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all ${mutedColor} ${hoverBg}`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-40 glass rounded-2xl shadow-floating-xl p-4 border border-white/20"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/60 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/shop" onClick={() => setMobileOpen(false)}>
                <button className="w-full mt-2 gradient-primary !text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md">
                  Shop Now
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
