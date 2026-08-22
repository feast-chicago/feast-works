"use client";

import ErrorIcon from "@/components/ErrorIcon";
import LoadingIcon from "@/components/LoadingIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBusiness } from "@/hooks/use-business";
import { Business } from "@/types/feast";
import { CircleAlert, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { business, isLoading, error } = useBusiness();

  return (
    <div className="min-h-dvh flex flex-col gap-10">
      <h1 className="font-secondary text-4xl">Settings</h1>
      {isLoading ? (
        <LoadingIcon />
      ) : error || !business ? (
        <ErrorIcon message="There was an error loading your business. Please try again." />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-10">
            <GeneralSettings business={business} />
            <BrandSettings />
            <PagesSettings />
          </div>
          <FeatureSettings />
        </>
      )}
    </div>
  );
}

function GeneralSettings({ business }: { business: Business }) {
  const [name, setName] = useState(business.name);
  const [tagline, setTagline] = useState(business.tagline ?? undefined);
  const [description, setDescription] = useState(
    business.description ?? undefined,
  );
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);

  const { line_1, line_2, city, state, zip_code } = business.business_address;
  const [address, setAddress] = useState(
    `${[line_1, line_2].filter((el) => el !== "").join(" ")}, ${city}, ${state} ${zip_code}`,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const { id, category } = business;

    await setIsLoading(true);
    await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ id, name, tagline, description, phone, email }]),
    })
      .then(() => {
        toast.success(
          `Your ${category.toLowerCase()} has successfully updated.`,
          { position: "bottom-right" },
        );
        setIsEditing(false);
      })
      .catch(() => {
        toast.error(
          `There was an issue updating your ${category.toLowerCase()}. Please try again.`,
          { position: "bottom-right" },
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">General</CardTitle>
        <CardDescription>Your basic business details.</CardDescription>
        <CardAction className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="destructive"
                size="icon-sm"
                className="bg-destructive text-destructive-foreground rounded-full"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <X />
                <span className="sr-only">Cancel</span>
              </Button>
              <Button
                variant="secondary"
                size="icon-sm"
                className="rounded-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : <Save />}
                <span className="sr-only">Save</span>
              </Button>
            </>
          ) : (
            <Button
              size="icon-sm"
              className="rounded-full"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Pencil />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <FieldSet>
            <FieldGroup>
              {/* Business name */}
              <Field>
                <FieldLabel htmlFor="business-name">
                  Business name <SettingsWarningIcon />
                </FieldLabel>
                <Input
                  id="business-name"
                  autoComplete="off"
                  placeholder="Example Restaurant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="disabled:bg-muted"
                />
              </Field>

              {/* Tagline */}
              <Field>
                <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                <Input
                  id="tagline"
                  autoComplete="off"
                  placeholder="Lorem ipsum dolor sit amet..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="disabled:bg-muted"
                />
                <FieldDescription className="text-xs">
                  A short and sweet tagline.
                </FieldDescription>
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel htmlFor="description">
                  Description <SettingsWarningIcon />
                </FieldLabel>
                <Textarea
                  id="description"
                  autoComplete="off"
                  placeholder="Lorem ipsum dolor sit amet..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="disabled:bg-muted"
                />
                <FieldDescription className="text-xs">
                  A more detailed description for your business.
                </FieldDescription>
              </Field>

              {/* Phone & Email */}
              <span className="grid max-w-sm grid-cols-2 gap-5">
                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input
                    id="phone"
                    autoComplete="off"
                    placeholder="+1 (773) 555-0100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="disabled:bg-muted"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    autoComplete="off"
                    placeholder="info@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="disabled:bg-muted"
                  />
                </Field>
              </span>

              {/* Business address */}
              <Field>
                <FieldLabel htmlFor="address">Business address</FieldLabel>
                <Input
                  id="address"
                  autoComplete="off"
                  placeholder="123 N Main St, Chicago, IL 60600"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="disabled:bg-muted"
                />
              </Field>

              {/* <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" autoComplete="off" aria-invalid />
              <FieldError></FieldError>
            </Field> */}
            </FieldGroup>
          </FieldSet>
        </form>
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

function SettingsWarningIcon() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleAlert className="size-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        The system needs a quick update to fully apply this change.
      </TooltipContent>
    </Tooltip>
  );
}
