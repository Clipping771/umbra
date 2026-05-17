import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDesc: { type: String, required: true },
    price: {
      "100g": { type: Number, required: true },
      "150g": { type: Number, required: true },
    },
    images: [{ type: String, required: true }],
    scent: { type: String, required: true },
    type: {
      type: String,
      enum: ["weightless", "standard"],
      default: "weightless",
    },
    ingredients: [{ type: String }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
