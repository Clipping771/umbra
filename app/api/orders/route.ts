import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { initSSLCommerz } from "@/lib/sslcommerz";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { customer, items, subtotal, deliveryFee, total, paymentMethod } = body;

    const order = await Order.create({
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    if (paymentMethod === "COD") {
      return NextResponse.json({ success: true, orderId: order._id, method: "COD" });
    }

    // Initialize SSLCommerz for online payments
    const paymentSession = await initSSLCommerz({
      total_amount: total,
      currency: "BDT",
      tran_id: order._id.toString(),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success?id=${order._id}`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail?id=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel?id=${order._id}`,
      cus_name: customer.name,
      cus_email: "customer@example.com", // Should be part of customer form if needed
      cus_add1: customer.address,
      cus_city: customer.district,
      cus_state: customer.district,
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: customer.phone,
      shipping_method: "Courier",
      product_name: items.map((i: any) => i.name).join(", "),
      product_category: "Skincare",
      product_profile: "general",
    });

    if (paymentSession?.GatewayPageURL) {
      return NextResponse.json({ 
        success: true, 
        url: paymentSession.GatewayPageURL, 
        method: "Online" 
      });
    }

    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  } catch (error) {
    console.error("Orders POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Admin only - would be protected
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
