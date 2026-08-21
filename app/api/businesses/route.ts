import { supabase } from "@/lib/supabase";
import { Business } from "@/types/feast";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const query = supabase().from("businesses").select<"*", Business>();

  // Only filter by ID if one was provided.
  // Otherwise, return all businesses.
  const { data, error } = id ? await query.eq("id", id).single() : await query;

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
