import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the current product to get its category
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json([], { status: 200 });
    }

    // Find related products in the same category, excluding current
    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: id },
      },
      take: 8,
      orderBy: { rating: "desc" },
    });

    return NextResponse.json(related);
  } catch (error) {
    console.error("Related products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch related products" }, { status: 500 });
  }
}
