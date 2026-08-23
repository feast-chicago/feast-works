import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Business } from "@/types/feast";

export default function FeatureSettings({ business }: { business: Business }) {
  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Features</CardTitle>
        <CardDescription>Your website's features.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-10 overflow-y-scroll">
        <span className="w-full flex flex-col">
          <h3 className="font-secondary text-xl">Patrons</h3>
          <p>Supported languages</p>
          <p>Customer accounts</p>
          <p>Rewards</p>
        </span>
        <Separator decorative />
        <span className="w-full flex flex-col">
          <h3 className="font-secondary text-xl">Ordering</h3>
          <p>Online ordering</p>
          <p>Scheduled ordering</p>
          <p>Group ordering</p>
          <p>POS Integration</p>
        </span>
        <Separator decorative />
        <span className="w-full flex flex-col">
          <h3 className="font-secondary text-xl">Dining</h3>
          <p>Reservations</p>
          <p>Bill splitting</p>
        </span>
      </CardContent>
    </Card>
  );
}
