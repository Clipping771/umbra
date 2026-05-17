"use client";

import { motion } from "framer-motion";

const categories = ["All", "Lavender", "Rose", "Neem", "Citrus", "Floral", "Earthy", "Fresh"];

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function FilterBar({ activeCategory, setActiveCategory }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mr-4 hidden sm:block">
        Filter By Scent:
      </span>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat 
                ? "!text-white" 
                : "text-muted-foreground hover:text-primary bg-secondary/40 hover:bg-secondary/80"
            }`}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 gradient-primary rounded-full shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
