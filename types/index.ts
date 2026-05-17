export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: {
    "100g": number;
    "150g": number;
  };
  images: string[];
  scent: string;
  type: "weightless" | "standard";
  ingredients: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  size: "100g" | "150g";
  qty: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    district: string;
    thana: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  transactionId?: string;
  createdAt: string;
}
