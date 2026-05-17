"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, Wallet, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const districts = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"];

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"Inside Dhaka" | "Outside Dhaka">("Inside Dhaka");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "Dhaka",
    thana: "",
  });

  const subtotal = getSubtotal();
  const deliveryFee = deliveryOption === "Inside Dhaka" ? 60 : 120;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "district") {
      setDeliveryOption(value === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka");
    }
  };

  const handleSubmit = async (e: React.FormEvent, method: "COD" | "Online") => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Required fields missing", {
        description: "Please fill in your shipping details to proceed.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items,
          subtotal,
          deliveryFee,
          total,
          paymentMethod: method,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (method === "Online" && data.url) {
          window.location.href = data.url;
        } else {
          clearCart();
          router.push(`/order-success?id=${data.orderId}`);
        }
      } else {
        toast.error(data.error || "Transaction failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal service error.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-8">
           <Lock className="w-8 h-8 text-primary/30" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Secure Checkout Session</h2>
        <p className="text-muted-foreground mb-10">Your bag is empty. Redirecting you to the shop...</p>
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2 }}
            className="w-full h-full gradient-primary"
            onAnimationComplete={() => router.push("/shop")}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-40 pb-40">
        <header className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-uppercase text-primary/60 mb-6 tracking-[0.3em]"
          >
            Encryption Enabled
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold text-foreground leading-tight tracking-tighter"
          >
            Secure <span className="gradient-text italic">Checkout</span>
          </motion.h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 max-w-7xl mx-auto items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-10 font-bold uppercase tracking-widest text-[11px]">
              <ArrowLeft className="w-4 h-4" /> Back to Bag
            </Link>

            <div className="surface rounded-[3rem] p-12 shadow-sm border border-border/40">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                  <Truck className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-foreground">Shipping Logistics</h3>
              </div>
              
              <form className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Full Name</label>
                  <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Recipient Name" className="h-16 rounded-2xl bg-secondary/30 border-none px-6 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Active Phone Number</label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01XXX XXXXXX" className="h-16 rounded-2xl bg-secondary/30 border-none px-6 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium" />
                </div>
                
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">District</label>
                    <select 
                      name="district" 
                      value={formData.district} 
                      onChange={handleInputChange}
                      className="w-full h-16 rounded-2xl bg-secondary/30 border-none px-6 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium outline-none appearance-none cursor-pointer"
                    >
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Area / Thana</label>
                    <Input name="thana" value={formData.thana} onChange={handleInputChange} placeholder="e.g. Banani" className="h-16 rounded-2xl bg-secondary/30 border-none px-6 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Detailed Street Address</label>
                  <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="House, Road, Apartment No." className="h-16 rounded-2xl bg-secondary/30 border-none px-6 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium" />
                </div>
              </form>
            </div>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="surface rounded-[3rem] p-12 shadow-2xl border border-border/40 sticky top-40">
              <h3 className="text-3xl font-heading font-bold text-foreground mb-10 text-center">Bag Summary</h3>
              
              <div className="space-y-5 mb-10 pb-10 border-b border-border/40 max-h-[300px] overflow-y-auto px-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between items-center text-base">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted/30 relative overflow-hidden flex-shrink-0">
                         <Image src={item.image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground uppercase font-black tracking-widest">{item.size} × {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-heading font-bold text-foreground">৳ {item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-lg text-muted-foreground">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-foreground">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-lg text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Courier Delivery</span>
                  </div>
                  <span className="font-bold text-foreground">৳ {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-4xl font-heading font-bold text-primary pt-6 border-t border-border/20">
                  <span>Total</span>
                  <span>৳ {total}</span>
                </div>
              </div>

              <div className="space-y-4">
                 <Button 
                   onClick={(e) => handleSubmit(e, "Online")}
                   disabled={loading}
                   className="w-full h-20 rounded-full text-xl font-bold gradient-primary text-white shadow-2xl hover:shadow-glow transition-all flex items-center justify-center gap-3"
                 >
                   {loading ? "Processing..." : (
                     <>
                        <CreditCard className="w-6 h-6" /> Pay Online
                     </>
                   )}
                 </Button>
                 
                 <Button 
                   onClick={(e) => handleSubmit(e, "COD")}
                   disabled={loading}
                   variant="outline"
                   className="w-full h-20 rounded-full text-xl font-bold border-border hover:bg-secondary/40 text-foreground transition-all flex items-center justify-center gap-3"
                 >
                   <Wallet className="w-6 h-6" /> Cash on Delivery
                 </Button>
              </div>
              
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] bg-primary/5 px-6 py-2 rounded-full">
                  <ShieldCheck className="w-4 h-4" /> SSL Secure Payment Gateway
                </div>
                <p className="text-[10px] text-center text-muted-foreground max-w-xs leading-relaxed uppercase tracking-widest">
                  bKash • Nagad • Visa • Mastercard <br/>
                  Bank-level 256-bit AES Encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
