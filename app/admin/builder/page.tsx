import { getBusiness } from "@/actions/business";
import { SiteLayout, SiteLayoutSchema } from "@/types/feast";
import { currentUser } from "@clerk/nextjs/server";
import Builder from "./_components/Builder";

export default async function BuilderPage() {
  const user = await currentUser();
  if (!user) return null;

  const business = await getBusiness(user.publicMetadata.businesses[0].id);
  const layout: SiteLayout = SiteLayoutSchema.parse(business.layout ?? {});

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-secondary text-4xl">Builder</h1>
      <Builder initialLayout={layout} businessId={business.id} />
    </div>
  );
}
