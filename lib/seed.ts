import dbConnect from "./db";
import Product from "./models/Product";

const seedData = [
  {
    name: "Weightless Lavender Dream",
    slug: "lavender-dream",
    description: "Experience the calming scent of lavender in a bar that truly floats. Whipped with air, this bar is lighter than water and provides a silky, cloud-like lather.",
    shortDesc: "The original floating lavender soap.",
    price: { "100g": 320, "150g": 420 },
    images: ["https://res.cloudinary.com/demo/image/upload/v1631234567/lavender_dream.jpg"],
    scent: "Lavender",
    type: "weightless",
    ingredients: ["Saponified Olive Oil", "Coconut Oil", "Lavender Essential Oil", "Purple Clay"],
    inStock: true,
    featured: true,
  },
  {
    name: "Rose Cloud Bar",
    slug: "rose-cloud",
    description: "A delicate rose-scented bar that floats gracefully in your bath. Perfect for a luxurious, floral-infused experience.",
    shortDesc: "A floating bouquet for your skin.",
    price: { "100g": 300, "150g": 390 },
    images: ["https://res.cloudinary.com/demo/image/upload/v1631234567/rose_cloud.jpg"],
    scent: "Rose",
    type: "weightless",
    ingredients: ["Saponified Almond Oil", "Shea Butter", "Rose Absolute", "Pink Kaolin Clay"],
    inStock: true,
    featured: false,
  },
  {
    name: "Neem Purify Float",
    slug: "neem-purify",
    description: "Purify your skin with the power of Neem and Turmeric in our signature floating bar. Antiseptic and refreshing.",
    shortDesc: "Antibacterial power that floats.",
    price: { "100g": 280, "150g": 360 },
    images: ["https://res.cloudinary.com/demo/image/upload/v1631234567/neem_purify.jpg"],
    scent: "Neem + Turmeric",
    type: "weightless",
    ingredients: ["Saponified Neem Oil", "Turmeric Powder", "Tea Tree Oil", "Bentonite Clay"],
    inStock: true,
    featured: false,
  },
];

export async function seedProducts() {
  await dbConnect();
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(seedData);
    console.log("Database seeded with initial products.");
  }
}
