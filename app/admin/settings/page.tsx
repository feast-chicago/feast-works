import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-secondary text-4xl">Settings</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        <GeneralSettings />
        <BrandSettings />
        <PagesSettings />
      </div>
      <FeatureSettings />
      <IntegrationSettings />
    </div>
  );
}

function GeneralSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">General</CardTitle>
        <CardDescription>Your basic business details.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

function BrandSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Brand</CardTitle>
        <CardDescription>Your business brand.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

function PagesSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Pages</CardTitle>
        <CardDescription>Your website's pages.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

function FeatureSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Features</CardTitle>
        <CardDescription>Your website's features.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

function IntegrationSettings() {
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
