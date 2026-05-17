"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="container mx-auto px-6 py-40 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto surface rounded-[4rem] p-16 md:p-24 shadow-2xl border border-border/40 relative overflow-hidden"
      >
        {/* Animated background flare */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            >
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </motion.div>
          </div>
          
          <div className="label-uppercase text-emerald-600 mb-6 tracking-[0.4em] font-black">Transaction Successful</div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-8 leading-tight tracking-tighter">
            Order <br/> <span className="gradient-text italic">Confirmed</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-16 max-w-lg mx-auto leading-relaxed">
            Thank you for choosing Lavender Umbra. Your collection piece is being carefully prepared for its weightless journey.
          </p>

          <div className="bg-secondary/40 rounded-[2.5rem] p-8 mb-16 flex flex-col md:flex-row items-center justify-between border border-border/40 gap-6">
            <div className="flex items-center gap-6 text-left">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Package className="text-primary w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Manifest ID</p>
                <p className="text-xl font-heading font-bold text-foreground">{orderId || "Processing"}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
               <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px]">
                Awaiting Fulfillment
              </Badge>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest italic">
                Email confirmation sent
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/shop" className="flex-1 max-w-[240px]">
              <Button className="w-full rounded-full h-16 text-lg font-bold gradient-primary !text-white shadow-2xl hover:shadow-glow transition-all">
                Continue Shop
              </Button>
            </Link>
            <Link href="/" className="flex-1 max-w-[240px]">
              <Button variant="outline" className="w-full rounded-full h-16 text-lg font-bold border-border hover:bg-secondary/40 text-foreground transition-all flex items-center justify-center gap-3">
                <Home className="w-5 h-5" /> Return Home
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-2 text-primary/40 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Sparkles className="w-4 h-4" /> Gravity Defying Skincare
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
