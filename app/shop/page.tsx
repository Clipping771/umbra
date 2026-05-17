"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import FilterBar from "@/components/shop/FilterBar";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append("category", activeCategory);
      if (searchQuery.trim() !== "") params.append("search", searchQuery);
      
      fetch(`/api/products?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Editorial Header */}
      <section className="pt-40 pb-16 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[80px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="label-uppercase text-primary/60 mb-6 tracking-[0.3em]"
            >
              Artisan Soap Boutique
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-heading font-bold text-foreground mb-8 leading-[0.95] tracking-tighter"
            >
              The <span className="gradient-text italic">Collection</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light"
            >
              Explore our range of weightless, air-whipped soaps. 
              Handcrafted in small batches for the ultimate cloud-like cleansing experience.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20 pb-40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <FilterBar 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search scents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-secondary/30 rounded-full pl-14 pr-6 text-sm border border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted/20 animate-pulse rounded-[2.5rem] border border-border/50" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {products.map((product, index) => (
                <motion.div
                  layout
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 surface rounded-[3rem] border border-dashed border-border"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
               <Search className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-3xl font-heading font-bold text-foreground mb-4">No scents found</h3>
            <p className="text-muted-foreground text-lg mb-10">We couldn't find any soaps matching your filter.</p>
            <button 
              onClick={() => setActiveCategory("All")}
              className="px-10 py-4 gradient-primary !text-white rounded-full font-bold shadow-lg hover:shadow-glow transition-all"
            >
              View All Products
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}
