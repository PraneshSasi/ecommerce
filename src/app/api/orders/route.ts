import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user actually exists in the DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: "User session is invalid" }, { status: 401 });
    }

    const body = await req.json();
    const {
      total,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      payment,
      items,
    } = body;

    // Validate request inputs
    if (
      total === undefined ||
      !fullName ||
      !phone ||
      !addressLine ||
      !city ||
      !state ||
      !pincode ||
      !payment ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Invalid order details" }, { status: 400 });
    }

    // Save the order to the database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: parseFloat(total.toString()),
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        payment,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(item.price.toString()),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
