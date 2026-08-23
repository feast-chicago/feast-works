import { fetchGoogleFonts } from "@/actions/fonts";
import SettingsClient from "./_components/SettingsClient";

export default async function SettingsPage() {
  const fonts = await fetchGoogleFonts();
  return <SettingsClient fonts={fonts} />;
}
