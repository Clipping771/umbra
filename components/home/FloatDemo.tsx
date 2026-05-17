"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Droplets } from "lucide-react";

export default function FloatDemo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="float-demo" className="section-padding bg-surface overflow-hidden relative">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="label-uppercase text-primary/60 mb-4 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              The Float Effect
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight mb-6 text-balance">
              Air is whipped into{" "}
              <span className="gradient-text italic">every single bar</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our proprietary whipping process incorporates millions of micro air
              bubbles into the saponified oils during production — reducing the
              bar's density below that of water. The result is a soap that
              gracefully floats in your bath.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Lighter than water", value: "< 1.0 g/cm³" },
                { label: "Air content", value: "~30% by volume" },
                { label: "Lather quality", value: "10× richer" },
                { label: "Shelf life", value: "18–24 months" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl bg-muted/50 border border-border/50"
                >
                  <p className="text-xl font-heading font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 label-uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Interactive animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <div
              className="relative w-[340px] h-[380px] flex flex-col items-center justify-center cursor-pointer select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Background circle */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-muted/40 to-blue-50/60 border border-border/30" />

              {/* Tooltip */}
              <motion.div
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 8,
                  scale: isHovered ? 1 : 0.95,
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-6 left-6 right-6 z-30 surface-elevated rounded-2xl p-4 pointer-events-none border border-border/40"
              >
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  ✨ Whipped with air — this bar floats because its density is{" "}
                  <span className="text-primary font-semibold">
                    less than water
                  </span>
                  .
                </p>
              </motion.div>

              {/* Soap bar */}
              <div className="relative z-20 mt-8">
                <motion.div
                  animate={{ y: isHovered ? [-10, 0] : [-10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <svg
                    width="200"
                    height="110"
                    viewBox="0 0 200 110"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_20px_40px_rgba(91,33,182,0.35)]"
                  >
                    <rect width="200" height="110" rx="26" fill="url(#soapFill)" />
                    {/* Highlight */}
                    <rect x="14" y="10" width="80" height="12" rx="6" fill="rgba(255,255,255,0.22)" />
                    {/* Air bubble details */}
                    <circle cx="60" cy="60" r="6" fill="rgba(255,255,255,0.12)" />
                    <circle cx="100" cy="72" r="4" fill="rgba(255,255,255,0.12)" />
                    <circle cx="140" cy="55" r="5" fill="rgba(255,255,255,0.12)" />
                    <defs>
                      <linearGradient id="soapFill" x1="0" y1="0" x2="200" y2="110" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="50%" stopColor="#5B21B6" />
                        <stop offset="100%" stopColor="#3B0764" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Brand text on soap */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-white/40 text-[9px] font-semibold tracking-[0.2em] uppercase">
                      Lavender Umbra
                    </p>
                    <p className="text-white/70 text-base font-heading italic font-bold mt-0.5">
                      Float Bar
                    </p>
                  </div>
                </motion.div>

                {/* Water / wave plane */}
                <div className="relative w-[220px] h-16 -mt-3 overflow-hidden rounded-b-2xl">
                  <svg
                    viewBox="0 0 800 80"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 w-[200%] h-full animate-wave"
                    style={{ left: 0 }}
                  >
                    <path
                      d="M0,40 C100,10 200,70 300,40 C400,10 500,70 600,40 C700,10 800,70 900,40 L900,80 L0,80 Z"
                      fill="#DBEAFE"
                      fillOpacity="0.7"
                    />
                    <path
                      d="M0,55 C120,30 220,80 350,55 C480,30 580,80 700,55 C780,40 820,60 900,50 L900,80 L0,80 Z"
                      fill="#BFDBFE"
                      fillOpacity="0.5"
                    />
                  </svg>
                </div>

                {/* Ripple rings */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full border-2 border-blue-300/40"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
