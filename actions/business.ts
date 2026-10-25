"use server";

import { supabase } from "@/lib/supabase";
import { Business, StorageItem } from "@/schema";
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

export async function uploadImage(
  file: File,
  businessId: string,
): Promise<{
  data: StorageItem;
  publicUrl: string;
}> {
  if (!file) throw new Error("No file provided.");

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.type))
    throw new Error("Invalid file type. Use a JPG, JPEG, PNG, WebP, or SVG.");

  if (file.size > 5 * 1024 * 1024)
    throw new Error("File too large. Max size is 5MB.");

  const pathname = `${businessId}/${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase()
    .storage.from("images")
    .upload(pathname, file, { upsert: true, contentType: file.type });

  if (uploadError)
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  if (!uploadData) throw new Error("Upload returned no data.");

  const { data: urlData } = await supabase()
    .storage.from("images")
    .getPublicUrl(uploadData.path);

  return { data: uploadData as StorageItem, publicUrl: urlData.publicUrl };
}
