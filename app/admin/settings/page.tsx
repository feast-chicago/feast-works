import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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
      {/* <IntegrationSettings /> */}
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
      <CardContent>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="business-name">Business name</FieldLabel>
              <Input
                id="business-name"
                autoComplete="off"
                placeholder="Example Restaurant"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
              <Input
                id="tagline"
                autoComplete="off"
                placeholder="Lorem ipsum dolor sit amet..."
              />
              <FieldDescription className="text-xs">
                A short and sweet tagline.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                autoComplete="off"
                placeholder="Lorem ipsum dolor sit amet..."
              />
              <FieldDescription className="text-xs">
                A more detailed description for your business.
              </FieldDescription>
            </Field>
            <span className="flex gap-10">
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  autoComplete="off"
                  placeholder="(773) 555-0100"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  autoComplete="off"
                  placeholder="info@example.com"
                />
              </Field>
            </span>

            <Field>
              <FieldLabel htmlFor="address">Business address</FieldLabel>
              <Input
                id="address"
                autoComplete="off"
                placeholder="123 N Main St, Chicago, IL 60600"
              />
            </Field>

            {/* <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" autoComplete="off" aria-invalid />
              <FieldError></FieldError>
            </Field> */}
          </FieldGroup>
        </FieldSet>
      </CardContent>
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
      <CardContent>
        <p>Logo</p>
        <p>Primary brand color</p>
        <p>Secondary brand color</p>
        <p>Primary font</p>
        <p>Secondary font</p>
        <p>Button radius</p>
        <p>Enable dark mode</p>
      </CardContent>
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
      <CardContent>
        <p>Menu page</p>
        <p>Catering page</p>
        <p>Shop page</p>
        <p>About page</p>
        <p>Gallery page</p>
      </CardContent>
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
      <CardContent className="flex flex-row gap-10">
        <span className="w-full flex flex-col">
          <p>Patrons</p>
          <p>Supported languages</p>
          <p>Customer accounts</p>
          <p>Rewards</p>
        </span>
        <Separator orientation="vertical" decorative />
        <span className="w-full flex flex-col">
          <p>Ordering</p>
          <p>Online ordering</p>
          <p>Scheduled ordering</p>
          <p>Group ordering</p>
          <p>POS Integration</p>
        </span>
        <Separator orientation="vertical" decorative />
        <span className="w-full flex flex-col">
          <p>Dining</p>
          <p>Reservations</p>
          <p>Bill splitting</p>
        </span>
      </CardContent>
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
