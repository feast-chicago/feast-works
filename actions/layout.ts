"use server";

import { supabase } from "@/lib/supabase";
import { SiteLayout, SiteLayoutSchema } from "@/types/feast";

export async function updateLayout(
  businessId: string,
  layout: SiteLayout,
): Promise<string | null> {
  const parsed = SiteLayoutSchema.safeParse(layout);
  if (!parsed.success) return "Invalid layout data.";

  const { error } = await supabase()
    .from("businesses")
    .update({ layout: parsed.data })
    .eq("id", businessId);

  return error ? error.message : null;
}
