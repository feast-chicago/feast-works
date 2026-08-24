"use server";

import { supabase } from "@/lib/supabase";
import { Business, StorageItem } from "@/types/feast";
import { unstable_cache } from "next/cache";

async function fetchFromSupabase(id: string): Promise<Business> {
  const { data, error } = await supabase()
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Failed to fetch business: ${error.message}`);
  if (!data) throw new Error("Business not found");

  return data as Business;
}

const fetchBusinessCached = unstable_cache(fetchFromSupabase, ["business"], {
  revalidate: 3600,
  tags: ["business"],
});

export async function getBusiness(id: string): Promise<Business> {
  // In development, skip the cache entirely so changes show up immediately.
  if (process.env.NODE_ENV === "development") {
    return fetchFromSupabase(id);
  }
  return fetchBusinessCached(id);
}

export async function uploadLogo(
  file: File,
  pathname: string,
): Promise<StorageItem> {
  const { data, error } = await supabase()
    .storage.from("images")
    .upload(pathname, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) throw new Error(`Failed to upload logo: ${error.message}`);
  if (!data) throw new Error("Logo not found");

  return data as StorageItem;
}
