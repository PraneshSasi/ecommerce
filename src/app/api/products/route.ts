import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function matchesToken(text: string, token: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  
  // Check 1: original word prefixes (split by non-alphanumeric characters)
  const originalWords = lowerText.split(/[^a-z0-9]+/i).filter(Boolean);
  if (originalWords.some(word => word.startsWith(token))) {
    return true;
  }
  
  // Check 2: camelCase/PascalCase/number sub-word prefixes
  const splitText = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
    .toLowerCase();
  const splitWords = splitText.split(/[^a-z0-9]+/i).filter(Boolean);
  
  return splitWords.some(word => word.startsWith(token));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "featured";
    const priceRange = searchParams.get("priceRange") || "all";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbWhereClause: any = {
      AND: [],
    };

    // Filter by category if specified
    if (category && category !== "All") {
      dbWhereClause.AND.push({ category: { equals: category } });
    }

    // Apply price range filtering
    if (priceRange === "budget") {
      dbWhereClause.AND.push({ price: { lt: 1000 } });
    } else if (priceRange === "mid") {
      dbWhereClause.AND.push({ price: { gte: 1000, lte: 10000 } });
    } else if (priceRange === "premium") {
      dbWhereClause.AND.push({ price: { gt: 10000 } });
    }

    // Determine sort ordering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderByClause: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderByClause = { price: "asc" };
    } else if (sort === "price_desc") {
      orderByClause = { price: "desc" };
    } else if (sort === "rating_desc") {
      orderByClause = { rating: "desc" };
    }

    const products = await prisma.product.findMany({
      where: dbWhereClause.AND.length > 0 ? dbWhereClause : {},
      orderBy: orderByClause,
    });

    // Apply tokenized prefix search in-memory to ensure precise matching
    let filteredProducts = products;
    if (query) {
      const searchTokens = query.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);
      if (searchTokens.length > 0) {
        filteredProducts = products.filter((product) => {
          const title = product.title || "";
          const brand = product.brand || "";
          
          return searchTokens.every((token) => {
            return matchesToken(title, token) || matchesToken(brand, token);
          });
        });
      } else {
        // If query has only special characters, return no results
        filteredProducts = [];
      }
    }

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
