"use server";

import { GoogleFont } from "@/types/feast";

interface GoogleFontsResponse {
  items: GoogleFont[];
}

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  const apiKey = process.env.GOOGLE_WEB_FONTS_API_KEY;
  if (!apiKey) throw new Error("Missing Google Web Fonts API key.");

  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
  );

  if (!res.ok) throw new Error("Failed to fetch Google Web Fonts.");

  const json = (await res.json()) as GoogleFontsResponse;
  return json.items;
}
