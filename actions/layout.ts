"use server";

import { supabase } from "@/lib/supabase";
import { Business, SiteLayout, SiteLayoutSchema } from "@/schema";

export async function updateLayout(
  business: Business,
  layout: SiteLayout,
): Promise<string | null> {
  const parsed = SiteLayoutSchema.safeParse(layout);
  if (!parsed.success) return "Invalid layout data.";

  const { error } = await supabase()
    .from("businesses")
    .update({ layout: parsed.data })
    .eq("id", business.id);

  return error ? error.message : null;
}
