import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the current product's category
    const { data: product, error: productError } = await supabase
      .from("Product")
      .select("category")
      .eq("id", id)
      .single();

    if (productError || !product) {
      return NextResponse.json([], { status: 200 });
    }

    // Find related products in same category, excluding current
    const { data: related, error: relatedError } = await supabase
      .from("Product")
      .select(
        "id, title, price, originalPrice, discount, rating, category, brand, stock, images"
      )
      .eq("category", product.category)
      .neq("id", id)
      .order("rating", { ascending: false })
      .limit(8);

    if (relatedError) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(related ?? []);
  } catch (error) {
    console.error("Related products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
