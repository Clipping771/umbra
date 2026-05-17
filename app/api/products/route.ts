import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { seedProducts } from "@/lib/seed";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    
    if (slug) {
      const product = await Product.findOne({ slug });
      return NextResponse.json(product);
    }
    
    const query: any = featured === "true" ? { featured: true } : {};
    
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (category && category !== "All") {
      query.scent = { $regex: new RegExp(category, "i") };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { scent: searchRegex },
        { description: searchRegex }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // This would normally be protected by admin auth
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Products POST Error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "A piece with this exact name already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
