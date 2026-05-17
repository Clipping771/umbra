"use client";

import { motion } from "framer-motion";
import { Wind, Droplets, Cloud, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Wind,
    title: "Artisanal Whipping",
    description: "Every bar is whipped at ultra-high speeds, incorporating microscopic air bubbles into the premium botanical oils.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Droplets,
    title: "Air Infusion",
    description: "These tiny air pockets change the physics of the bar, making its overall density lower than that of water.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Cloud,
    title: "Naturally Buoyant",
    description: "The final result is a luxury soap that floats weightlessly, providing a cloud-like experience in every bath.",
    color: "bg-pink-50 text-pink-600",
  },
];

export default function WhyItFloats() {
  return (
    <section className="section-padding bg-surface overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="label-uppercase text-primary/60 mb-4 tracking-[0.3em]">Our Philosophy</div>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            The Physics of <span className="gradient-text italic">Weightlessness</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We've combined traditional Bangladeshi craftsmanship with modern aeration techniques 
            to create a skincare experience that literally floats above the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Step number connector line (between cards) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border/60 to-transparent z-0 -translate-y-0" style={{ width: "calc(100% - 5rem)", left: "5rem" }} />
              )}

              <div className={`w-20 h-20 rounded-3xl ${step.color} flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 relative z-10`}>
                <step.icon className="w-9 h-9" />
              </div>
              
              <div className="flex items-center gap-4 mb-5">
                <span className="text-6xl font-heading font-black text-foreground/[0.04] leading-none select-none">{String(index + 1).padStart(2, "0")}</span>
                <h4 className="text-2xl font-heading font-bold text-foreground">{step.title}</h4>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-base mb-8">
                {step.description}
              </p>
              
              <div className="w-10 h-0.5 bg-primary/20 group-hover:w-20 group-hover:bg-primary/40 transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative large text */}
      <div className="absolute -bottom-10 left-0 right-0 pointer-events-none overflow-hidden select-none whitespace-nowrap">
        <span className="text-[15rem] font-heading font-black text-foreground/[0.02] uppercase tracking-tighter">
          Weightless Artisan Skincare
        </span>
      </div>
    </section>
  );
}
