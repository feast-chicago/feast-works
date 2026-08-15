import { Caprasimo, Inter } from "next/font/google";

export const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
});

export const secondaryFont = Caprasimo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-secondary",
});
