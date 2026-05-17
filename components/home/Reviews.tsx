"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Ayesha Rahman",
    text: "It truly feels like a cloud when you hold it. The scent is absolutely divine!",
    location: "Dhaka, Bangladesh",
    rating: 5,
    avatar: "A",
  },
  {
    name: "Zubayer Ahmed",
    text: "I was skeptical about the floating part, but it actually does! Great for gifts.",
    location: "Sylhet, Bangladesh",
    rating: 5,
    avatar: "Z",
  },
  {
    name: "Sumi Akter",
    text: "Lavender soap is my favorite. This one feels so premium and doesn't melt away fast.",
    location: "Chattogram, Bangladesh",
    rating: 5,
    avatar: "S",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="label-uppercase text-primary/60 mb-4 tracking-[0.3em]">Client Stories</div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight">
              Loved by the <span className="gradient-text italic">Community</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 bg-secondary/50 px-6 py-3 rounded-full border border-border/40"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="font-heading font-bold text-xl text-foreground">4.9</span>
            <span className="text-muted-foreground text-sm font-medium">/ 5.0</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="surface p-10 rounded-[2.5rem] relative group border border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-floating-xl"
            >
              {/* Decorative quote */}
              <div className="absolute top-8 right-8 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500">
                <Quote className="w-14 h-14 text-primary fill-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-7">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              
              {/* Review text */}
              <blockquote className="text-lg text-foreground/80 font-medium italic mb-10 leading-relaxed min-h-[100px]">
                "{review.text}"
              </blockquote>
              
              {/* Divider */}
              <div className="w-full h-px bg-border/50 mb-8" />

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <h5 className="font-heading font-bold text-foreground">{review.name}</h5>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
