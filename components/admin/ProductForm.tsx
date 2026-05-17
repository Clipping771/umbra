"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";

interface ProductFormValues {
  name: string;
  description: string;
  shortDesc: string;
  price100: number | string;
  price150: number | string;
  scent: string;
  featured: boolean;
  ingredients: string;
  type: "weightless" | "standard";
}


export default function ProductForm({ onSuccess, initialData }: { onSuccess: () => void, initialData?: Product }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.images?.[0] || "");

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      shortDesc: initialData.shortDesc,
      price100: initialData.price["100g"],
      price150: initialData.price["150g"],
      scent: initialData.scent,
      featured: initialData.featured,
      ingredients: initialData.ingredients?.join(", ") || "",
      type: initialData.type || "standard"
    } : {
      type: "standard",
      name: "",
      description: "",
      shortDesc: "",
      price100: "",
      price150: "",
      scent: "",
      featured: false,
      ingredients: ""
    }
  });
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        toast.success("Artwork synchronization successful");
      } else {
        throw new Error(data.error || "Upload protocol failed");
      }
    } catch (err: any) {
      toast.error("Upload Failed", { 
        description: err.message || "Please check your network or try pasting a URL instead." 
      });
    } finally {
      setUploading(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Required fields missing", { description: "Please fill in all mandatory details." });
  };

  const onSubmit = async (data: any) => {
    if (!imageUrl) {
      toast.error("Product image required", { description: "Please upload a photo or paste a URL." });
      return;
    }

    setLoading(true);
    try {
      const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
      const method = initialData ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          slug: initialData ? initialData.slug : data.name.toLowerCase().replace(/ /g, "-"),
          images: [imageUrl],
          price: {
            "100g": Number(data.price100),
            "150g": Number(data.price150),
          },
          ingredients: data.ingredients ? data.ingredients.split(",").map((i: string) => i.trim()) : [],
        }),
      });

      if (res.ok) {
        toast.success(initialData ? "Masterpiece updated successfully!" : "New masterpiece added to the collection!");
        if (!initialData) {
          reset();
          setImageUrl("");
        }
        onSuccess();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed");
      }
    } catch (err: any) {
      toast.error(initialData ? "Update Failed" : "Creation Failed", { 
        description: err.message || (initialData ? "An error occurred while updating." : "An error occurred while publishing to the gallery.") 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Master Identity</label>
          <Input 
            {...register("name", { required: "Name is required" })} 
            placeholder="e.g. Lavender Dream" 
            className={`h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all ${errors.name ? "ring-2 ring-destructive/20" : ""}`}
          />
          {errors.name && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.name.message as string}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Scent Category</label>
          <div className="relative">
            <select 
              {...register("scent", { required: "Scent category is required" })} 
              className={`w-full h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all appearance-none cursor-pointer ${errors.scent ? "ring-2 ring-destructive/20" : ""}`}
            >
              <option value="" disabled>Select a scent category...</option>
              <option value="Lavender">Lavender</option>
              <option value="Rose">Rose</option>
              <option value="Neem">Neem</option>
              <option value="Citrus">Citrus</option>
              <option value="Floral">Floral</option>
              <option value="Earthy">Earthy</option>
              <option value="Fresh">Fresh</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          {errors.scent && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.scent.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Creation Category</label>
          <div className="flex h-14 w-full rounded-2xl bg-secondary/20 p-1 relative">
            <button
              type="button"
              onClick={() => setValue('type', 'weightless')}
              className={`flex-1 rounded-xl text-sm font-bold z-10 transition-colors ${watch('type') === 'weightless' ? '!text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Weightless Collection
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'standard')}
              className={`flex-1 rounded-xl text-sm font-bold z-10 transition-colors ${watch('type') === 'standard' ? '!text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Standard Artisan
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl gradient-primary transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 ${watch('type') === 'weightless' ? 'translate-x-0' : 'translate-x-full ml-1'}`}
            />
            <input type="hidden" {...register("type")} />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Botanical Ingredients</label>
          <Input {...register("ingredients")} placeholder="Olive Oil, Dried Lavender, etc." className="h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Boutique Narrative (Short)</label>
        <Input 
          {...register("shortDesc", { required: "Short description is required" })} 
          placeholder="One line of artisan magic..." 
          className={`h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all ${errors.shortDesc ? "ring-2 ring-destructive/20" : ""}`}
        />
        {errors.shortDesc && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.shortDesc.message as string}</p>}
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Full Artisan Story</label>
        <Textarea 
          {...register("description", { required: "Full description is required" })} 
          placeholder="Tell the story of this creation..." 
          className={`min-h-[150px] rounded-[2rem] bg-secondary/20 border-none p-8 text-sm focus:bg-white transition-all resize-none leading-relaxed ${errors.description ? "ring-2 ring-destructive/20" : ""}`}
        />
        {errors.description && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.description.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Price Tier: 100g (BDT)</label>
          <Input 
            type="number" 
            {...register("price100", { required: "Price is required" })} 
            placeholder="320" 
            className={`h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all ${errors.price100 ? "ring-2 ring-destructive/20" : ""}`}
          />
          {errors.price100 && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.price100.message as string}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Price Tier: 150g (BDT)</label>
          <Input 
            type="number" 
            {...register("price150", { required: "Price is required" })} 
            placeholder="420" 
            className={`h-14 rounded-2xl bg-secondary/20 border-none px-6 text-sm focus:bg-white transition-all ${errors.price150 ? "ring-2 ring-destructive/20" : ""}`}
          />
          {errors.price150 && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.price150.message as string}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Visual Manifestation</label>
        <div className="bg-secondary/10 rounded-[2.5rem] p-10 border-2 border-dashed border-border/40 hover:border-primary/40 transition-all">
          <div className="flex flex-col gap-8 items-center text-center">
            {!imageUrl && !uploading && (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <p className="text-sm font-bold text-muted-foreground italic">No artwork defined yet</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-6 items-center w-full max-w-2xl mx-auto">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <Button 
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-10 h-16 border-2 border-primary/20 rounded-2xl hover:bg-primary/5 hover:border-primary/40 transition-all group shrink-0"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                <span className="font-bold text-sm">{imageUrl ? "Replace Artwork" : "Upload Piece Photo"}</span>
              </Button>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white px-4 py-1 rounded-full shadow-sm">or</div>
              <Input 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="Paste external image URL..." 
                className="flex-1 h-16 bg-white border-none rounded-2xl px-8 text-sm shadow-inner focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
          
          <AnimatePresence>
            {imageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-12 flex justify-center"
              >
                <div className="group relative w-64 h-64 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-black/5 transition-transform hover:scale-105 duration-500">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-0 right-0 text-center translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Badge className="bg-white/90 backdrop-blur-md text-foreground text-[10px] font-black uppercase tracking-widest border border-accent/20 px-6 py-2 shadow-lg">Studio Preview</Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[10px] text-muted-foreground/60 italic text-center px-12">
          Tip: If you don't have Cloudinary credentials configured in your environment yet, you can paste any public image URL instead.
        </p>
      </div>

      <div className="pt-6">
        <Button 
          type="submit"
          disabled={loading || uploading} 
          className="w-full h-16 rounded-[2rem] text-lg font-black gradient-primary !text-white shadow-xl hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {loading ? (
             <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>{initialData ? "Updating Masterpiece..." : "Publishing to Gallery..."}</span>
             </div>
          ) : !imageUrl ? (
            "Upload Artwork First"
          ) : (
            initialData ? "Save Masterpiece Updates" : "Finalize & Add to Collection"
          )}
        </Button>
      </div>
    </form>
  );
}
