import { getBusiness } from "@/actions/business";
import { LayoutSchema } from "@/types/feast";
import Builder from "./_components/Builder";
import { currentUser } from "@clerk/nextjs/server";

export default async function BuilderPage() {
  // server-side fetch using the org ID from auth
  // you'll need to get the businessId from the Clerk session here
  const user = await currentUser();
  if (!user) return;

  const { publicMetadata } = user;
  const business = await getBusiness(publicMetadata.businesses[0].id);
  const layout = LayoutSchema.parse(business.layout ?? []);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-secondary text-4xl">Builder</h1>
      <Builder initialLayout={layout} businessId={business.id} />
    </div>
  );
}
