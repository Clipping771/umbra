import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { validateSSLCommerz } from "@/lib/sslcommerz";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const val_id = formData.get("val_id") as string;
    const tran_id = formData.get("tran_id") as string;

    // Validate the payment
    const validation = await validateSSLCommerz(val_id);

    if (validation?.status === "VALID" || validation?.status === "AUTHENTICATED") {
      await Order.findByIdAndUpdate(tran_id, {
        paymentStatus: "paid",
        transactionId: tran_id,
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?id=${tran_id}`,
        { status: 303 }
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=payment_failed`,
      { status: 303 }
    );
  } catch (error) {
    console.error("Payment Success Callback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
