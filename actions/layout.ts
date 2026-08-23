"use server";

import { supabase } from "@/lib/supabase";
import { Layout, LayoutSchema } from "@/types/feast";

export async function updateLayout(
  businessId: string,
  layout: Layout,
): Promise<string | null> {
  // Validate before writing.
  const parsed = LayoutSchema.safeParse(layout);
  if (!parsed.success) return "Invalid layout data.";

  const { error } = await supabase()
    .from("businesses")
    .update({ layout: parsed.data })
    .eq("id", businessId);

  return error ? error.message : null;
}
