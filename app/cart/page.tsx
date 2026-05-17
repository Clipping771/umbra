"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQty, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-40 pb-40">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-uppercase text-primary/60 mb-4 tracking-[0.3em]"
          >
            Your Selection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-heading font-bold text-foreground leading-[0.9] tracking-tighter"
          >
            Shopping <span className="gradient-text italic">Bag</span>
          </motion.h1>
        </header>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface rounded-[3rem] p-24 text-center border border-dashed border-border/60"
          >
            <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-10">
              <ShoppingBag className="w-10 h-10 text-primary/30" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Your bag is weightless</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
              It seems you haven't added any floating artisan soaps to your collection yet.
            </p>
            <Link href="/shop">
              <Button className="rounded-full px-12 h-16 text-lg font-bold gradient-primary shadow-2xl hover:shadow-glow transition-all">
                Shop the Collection
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Bag Items */}
            <div className="lg:col-span-8 space-y-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    layout
                    key={`${item.productId}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="surface rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center gap-10 border border-border/40 group hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-md"
                  >
                    <div className="relative w-40 h-40 rounded-3xl overflow-hidden bg-muted/30 flex-shrink-0 border border-border/20">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div>
                          <h3 className="text-3xl font-heading font-bold text-foreground mb-1">{item.name}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">{item.size}</span>
                            <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">In Stock</span>
                          </div>
                        </div>
                        <p className="text-2xl font-heading font-bold text-foreground">৳ {item.price * item.qty}</p>
                      </div>
                      
                      <div className="flex justify-between items-center bg-background/50 rounded-2xl p-4 border border-border/30">
                        <div className="flex items-center gap-8">
                          <button 
                            onClick={() => updateQty(item.productId, item.size, item.qty - 1)} 
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border/40"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="font-heading font-bold text-xl w-6 text-center text-foreground">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.productId, item.size, item.qty + 1)} 
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border/40"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.productId, item.size)}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all border border-transparent hover:border-destructive/20"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-4">
              <div className="surface rounded-[3rem] p-10 shadow-2xl border border-border/40 sticky top-40">
                <h3 className="text-3xl font-heading font-bold text-foreground mb-10">Total Summary</h3>
                
                <div className="space-y-6 mb-10 pb-10 border-b border-border/40">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Bag Subtotal</span>
                    <span className="font-bold text-foreground">৳ {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Standard Delivery</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full flex items-center">
                       Calculated Next
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-3xl font-heading font-bold text-primary mb-12">
                  <span>Grand Total</span>
                  <span>৳ {subtotal}</span>
                </div>
                
                <Link href="/checkout" className="block w-full">
                  <Button className="w-full h-20 rounded-full text-xl font-bold gradient-primary text-white shadow-2xl hover:shadow-glow transition-all group">
                    Proceed to Secure Checkout
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                
                <div className="mt-10 flex items-center justify-center gap-4 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em]">
                    SSL Secure Transaction
                  </p>
                </div>
                
                <div className="mt-8 flex justify-center gap-3 opacity-30 grayscale">
                  {/* Payment icon placeholders */}
                   <div className="w-10 h-6 bg-foreground/20 rounded" />
                   <div className="w-10 h-6 bg-foreground/20 rounded" />
                   <div className="w-10 h-6 bg-foreground/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
