import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Business } from "@/types/feast";

export default function IntegrationSettings({
  business,
}: {
  business: Business;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Integrations</CardTitle>
        <CardDescription>Your website's connected apps.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
