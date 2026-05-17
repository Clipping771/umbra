"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      size: "100g",
      qty: 1,
      price: product.price["100g"],
      image: product.images[0],
    });
    toast.success(`${product.name} added to your bag`, {
      description: "You can view your bag and checkout anytime.",
      action: {
        label: "View Bag",
        onClick: () => window.location.href = "/cart",
      },
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group surface rounded-[2.5rem] overflow-hidden border border-border/30 hover:border-accent/40 transition-all duration-700 hover:shadow-floating-xl"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#FDFCFF]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {product.type === "weightless" && (
            <div className="absolute top-6 left-6">
              <Badge className="bg-white/80 backdrop-blur-md text-foreground hover:bg-white border border-accent/20 px-5 py-2 text-[10px] font-bold uppercase tracking-widest shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 animate-pulse" />
                Weightless
              </Badge>
            </div>
          )}
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1033]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Quick-add button that appears on hover */}
          <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-2xl bg-foreground/90 backdrop-blur-md !text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Quick Add
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
              {product.scent}
            </span>
            <div className="text-lg font-heading font-bold text-foreground">
              ৳{product.price["100g"]}
            </div>
          </div>
          
          <h3 className="text-2xl font-heading font-bold text-foreground mb-3 leading-tight">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-light line-clamp-2 italic">
            "{product.shortDesc}"
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
              View Details <ArrowRight className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
