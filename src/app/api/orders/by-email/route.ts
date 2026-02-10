import { NextRequest, NextResponse } from "next/server";
import { getOrdersByEmail } from "@/lib/orders";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  try {
    const orders = await getOrdersByEmail(email);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders by email:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
