"use client";

import ErrorIcon from "@/components/ErrorIcon";
import LoadingIcon from "@/components/LoadingIcon";
import { useBusiness } from "@/hooks/use-business";
import { GoogleFont } from "@/types/feast";
import BrandSettings from "./BrandSettings";
import FeatureSettings from "./FeatureSettings";
import GeneralSettings from "./GeneralSettings";

export default function SettingsClient({ fonts }: { fonts: GoogleFont[] }) {
  const { business, isLoading, error } = useBusiness();

  return (
    <div className="h-full flex flex-col gap-10">
      <h1 className="font-secondary text-4xl">Settings</h1>
      {isLoading ? (
        <LoadingIcon />
      ) : error || !business ? (
        <ErrorIcon message="There was an error loading your business. Please try again." />
      ) : (
        <>
          <div className="min-h-0 flex flex-col lg:flex-row gap-10">
            <GeneralSettings business={business} />
            <BrandSettings business={business} fonts={fonts} />
            <FeatureSettings business={business} />
          </div>
        </>
      )}
    </div>
  );
}
