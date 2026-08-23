import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Business } from "@/types/feast";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SettingsWarningIcon from "./SettingsWarningIcon";

export default function GeneralSettings({ business }: { business: Business }) {
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
    <Card className="size-full">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">General</CardTitle>
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
                    type="tel"
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
                    type="email"
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
