"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, ShieldCheck, Wind, Check, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<"100g" | "150g">("100g");
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });

    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((data) => setRelated(data.slice(0, 4)));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      size: selectedSize,
      qty: 1,
      price: product.price[selectedSize],
      image: product.images[0],
    });
    toast.success(`${product.name} added to your bag`, {
      description: `Size: ${selectedSize}`,
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-40 flex flex-col items-center">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading collection details...</p>
      </div>
    </div>
  );
  
  if (!product) return <div className="min-h-screen flex items-center justify-center font-heading text-3xl">Collection piece not found</div>;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 lg:pt-48 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          {/* Visual Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10 sticky top-40"
          >
            <div className="relative aspect-[1/1.1] rounded-[3rem] overflow-hidden surface-floating border border-border/40 group">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                unoptimized={true}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              {product.type === "weightless" && (
                <div className="absolute top-8 left-8">
                  <Badge className="bg-white/90 backdrop-blur-xl text-primary hover:bg-white border-none px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3 animate-pulse" />
                    Weightless Series
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square rounded-3xl surface border border-border/40 overflow-hidden cursor-pointer hover:border-primary transition-all duration-300 relative group">
                   <Image src={product.images[0]} alt="" fill unoptimized={true} sizes="100px" className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col pt-4"
          >
            <div className="mb-12">
              <div className="flex items-center gap-6 mb-6">
                <span className="label-uppercase text-primary/60">{product.scent}</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6 leading-[1.1] tracking-tighter">
                {product.name.split(' ').slice(0, -1).join(' ')} <br/>
                <span className="gradient-text italic">{product.name.split(' ').slice(-1)}</span>
              </h1>
              <div className="text-4xl font-heading font-bold text-accent">৳ {product.price[selectedSize]}</div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed font-light mb-12 text-balance">
              {product.description}
            </p>

            {/* Selection Grid */}
            <div className="mb-12">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-6">Volume Selection</h4>
              <div className="grid grid-cols-2 gap-4">
                {(["100g", "150g"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`relative py-6 rounded-2xl border-2 transition-all duration-500 group overflow-hidden ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white shadow-xl shadow-primary/20"
                        : "border-border bg-white text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="relative z-10 text-lg font-bold">{size}</span>
                    <span className="block relative z-10 text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">
                      Full Artisan Bar
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button onClick={handleAddToCart} className="flex-[2] h-20 rounded-full text-xl font-bold gradient-primary shadow-2xl hover:shadow-glow transition-all duration-500">
                <ShoppingBag className="mr-3 h-6 w-6" /> Add to Shopping Bag
              </Button>
              <Link href="/checkout" className="flex-1">
                 <Button variant="outline" className="w-full h-20 rounded-full text-lg font-bold border-border hover:bg-secondary/40 text-foreground transition-all duration-500">
                   Instant Buy
                 </Button>
              </Link>
            </div>

            {/* Feature Strips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12 border-b border-border/50 mb-12">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="text-primary w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">100% Organic Botanical</span>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Wind className="text-primary w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">Lighter Than Water</span>
              </div>
            </div>

            {/* Detailed Content Accordion */}
            <Accordion className="w-full border-none">
              <AccordionItem value="ingredients" className="border-border/50 mb-4">
                <AccordionTrigger className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors py-6">
                  Pure Ingredients
                </AccordionTrigger>
                <AccordionContent className="pb-8">
                  <div className="flex flex-wrap gap-3">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="px-5 py-2 rounded-full bg-muted/40 text-muted-foreground text-sm font-medium border border-border/30">
                        {ing}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-muted-foreground text-base leading-relaxed italic">
                    Our soaps are free from synthetic parabens, sulfates, and artificial hardeners. 
                    Each ingredient is ethically sourced from local Bangladeshi farmers.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="shipping" className="border-border/50">
                <AccordionTrigger className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors py-6">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-muted-foreground text-base leading-relaxed">
                  We offer premium express shipping across Bangladesh. Orders inside Dhaka are delivered within 24-48 hours. 
                  Due to the artisanal nature of our products, we only accept returns for damaged items during transit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* Discovery Section */}
        <section className="pt-40 border-t border-border/30">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="label-uppercase text-primary/60 mb-4">Discovery</span>
              <h3 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                Complete the <span className="gradient-text italic">Cloud Experience</span>
              </h3>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 text-primary font-bold text-lg">
              Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {related.filter(p => p._id !== product._id).slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
