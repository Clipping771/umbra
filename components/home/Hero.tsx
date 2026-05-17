"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep gradient background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#E5C594]/20 blur-[120px] pointer-events-none animate-float-slow" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#2A1647]/40 blur-[100px] pointer-events-none animate-float-slow" style={{ animationDuration: "15s", animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#D4AF37]/10 blur-[80px] pointer-events-none animate-float-slow" style={{ animationDuration: "18s", animationDelay: "1s" }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C594] animate-pulse" />
          <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">
            Handcrafted in Bangladesh
          </span>
          <Sparkles className="w-3.5 h-3.5 text-white/60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.05] tracking-tight mb-8 text-balance"
        >
          Soap That
          <br />
          <span className="gradient-text-gold italic">
            Truly Floats
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-4 font-light leading-relaxed italic"
        >
          Floats in water. Feels like clouds in your hands.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base text-white/40 max-w-xl mx-auto mb-14 leading-relaxed"
        >
          Our artisan soaps are whipped with air — making every bar lighter than water itself. Luxury redefined.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/shop">
            <button className="group inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base">
              Shop the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href="#float-demo">
            <button className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm text-white font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-base">
              <Zap className="w-4 h-4 text-yellow-300" />
              See It Float
            </button>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-20 pt-10 border-t border-white/10 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "100%", label: "Organic Oils" },
            { value: "3+", label: "Floating Variants" },
            { value: "500+", label: "Happy Customers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
