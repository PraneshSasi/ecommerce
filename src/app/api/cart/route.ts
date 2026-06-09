import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user actually exists in the DB (JWT may contain stale ID after re-seed)
    const userExists = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true } });
    if (!userExists) {
      return NextResponse.json(
        { error: "Session expired. Please sign out and sign back in." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { productId, quantity = 1 } = body;
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    let cartItem;
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId: session.user.id, productId, quantity },
        include: { product: true },
      });
    }
    const cartCount = await prisma.cartItem.count({ where: { userId: session.user.id } });
    return NextResponse.json({ cartItem, cartCount }, { status: 201 });
  } catch (error) {
    console.error("[CART POST] Error:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { cartItemId } = await req.json();
    await prisma.cartItem.deleteMany({
      where: { id: cartItemId, userId: session.user.id },
    });
    const cartCount = await prisma.cartItem.count({ where: { userId: session.user.id } });
    return NextResponse.json({ success: true, cartCount });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { cartItemId, quantity } = await req.json();
    if (quantity < 1) {
      await prisma.cartItem.deleteMany({ where: { id: cartItemId, userId: session.user.id } });
    } else {
      await prisma.cartItem.updateMany({
        where: { id: cartItemId, userId: session.user.id },
        data: { quantity },
      });
    }
    const cartCount = await prisma.cartItem.count({ where: { userId: session.user.id } });
    return NextResponse.json({ success: true, cartCount });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
