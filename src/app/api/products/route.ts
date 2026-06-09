import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "featured";
    const priceRange = searchParams.get("priceRange") || "all";

    const whereClause: any = {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query } },
                { brand: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {},
        category && category !== "All"
          ? { category: { equals: category } }
          : {},
      ],
    };

    // Apply price range filtering
    if (priceRange === "budget") {
      whereClause.AND.push({ price: { lt: 1000 } });
    } else if (priceRange === "mid") {
      whereClause.AND.push({ price: { gte: 1000, lte: 10000 } });
    } else if (priceRange === "premium") {
      whereClause.AND.push({ price: { gt: 10000 } });
    }

    // Determine sort ordering
    let orderByClause: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderByClause = { price: "asc" };
    } else if (sort === "price_desc") {
      orderByClause = { price: "desc" };
    } else if (sort === "rating_desc") {
      orderByClause = { rating: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
