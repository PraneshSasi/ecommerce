import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Server-side in-memory cache
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedProducts: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds

function matchesToken(text: string, token: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();

  const originalWords = lowerText.split(/[^a-z0-9]+/i).filter(Boolean);
  if (originalWords.some((word) => word.startsWith(token))) return true;

  const splitText = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
    .toLowerCase();
  const splitWords = splitText.split(/[^a-z0-9]+/i).filter(Boolean);
  return splitWords.some((word) => word.startsWith(token));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "featured";
    const priceRange = searchParams.get("priceRange") || "all";

    const now = Date.now();
    if (!cachedProducts || now - cacheTimestamp > CACHE_TTL) {
      console.log("⚡ [Products API] Cache miss. Fetching via Supabase REST...");

      const { data, error } = await supabase
        .from("Product")
        .select(
          "id, title, price, originalPrice, discount, rating, category, brand, stock, images, createdAt"
        );

      if (error) {
        console.error("Supabase fetch error:", error);
        return NextResponse.json(
          { error: "Failed to fetch products" },
          { status: 500 }
        );
      }

      cachedProducts = data ?? [];
      cacheTimestamp = now;
    } else {
      console.log("⚡ [Products API] Cache hit!");
    }

    let filteredProducts = [...cachedProducts];

    if (category && category !== "All") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (priceRange === "budget") {
      filteredProducts = filteredProducts.filter((p) => p.price < 1000);
    } else if (priceRange === "mid") {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= 1000 && p.price <= 10000
      );
    } else if (priceRange === "premium") {
      filteredProducts = filteredProducts.filter((p) => p.price > 10000);
    }

    if (query) {
      const searchTokens = query
        .toLowerCase()
        .split(/[^a-z0-9]+/i)
        .filter(Boolean);
      if (searchTokens.length > 0) {
        filteredProducts = filteredProducts.filter((p) =>
          searchTokens.every(
            (token) => matchesToken(p.title, token) || matchesToken(p.brand, token)
          )
        );
      } else {
        filteredProducts = [];
      }
    }

    if (sort === "price_asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "rating_desc") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    } else {
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
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
