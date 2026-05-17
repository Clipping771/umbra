"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, Sparkles, User, KeyRound, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Access Denied", { description: "Invalid credentials." });
      } else {
        toast.success("Welcome back", { description: "Redirecting to your dashboard..." });
        router.push("/admin");
      }
    } catch (error) {
      toast.error("Error", { description: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFF] px-6 relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">
            Private <span className="gradient-text italic">Access</span>
          </h1>
          <p className="text-muted-foreground font-light tracking-wide">Enter your credentials to manage the collection.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-floating-xl border border-border/40 p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="admin" 
                  className="h-14 rounded-2xl bg-secondary/20 border-none pl-14 pr-6 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-base"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                  <KeyRound className="w-5 h-5" />
                </div>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-secondary/20 border-none pl-14 pr-6 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-base"
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading} 
              className="w-full h-14 rounded-full text-base font-bold gradient-primary !text-white shadow-xl hover:shadow-glow transition-all mt-4"
            >
              {loading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Authenticate Access"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
