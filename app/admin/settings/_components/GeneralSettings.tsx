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
import { Address, Business } from "@/types/feast";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AddressPicker from "./AddressPicker";
import SettingsWarningIcon from "./SettingsWarningIcon";

export default function GeneralSettings({ business }: { business: Business }) {
  const [name, setName] = useState(business.name);
  const [tagline, setTagline] = useState(business.tagline ?? undefined);
  const [description, setDescription] = useState(
    business.description ?? undefined,
  );
  const [phone, setPhone] = useState(formatPhoneNumberAsString(business.phone));
  const [email, setEmail] = useState(business.email);

  const { formatted_address } = business.business_address[0];
  const [address, setAddress] = useState(formatted_address);
  const [addressObject, setAddressObject] = useState<Address[]>(
    business.business_address,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function formatPhoneNumberAsString(value: string | number): string {
    // Strip everything that isn't a digit
    const digits = String(value).replace(/\D/g, "");

    // Format as +1 (XXX) XXX-XXXX
    if (digits.length === 0) return "";
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits[0]} (${digits.slice(1)}`;
    if (digits.length <= 7)
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 11)
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;

    // Cap at 11 digits (+1 and 10-digit number)
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
  }

  function formatNumberAsDigits(value: string | number): number {
    const digits = String(value).replace(/\D/g, "");
    return parseInt(digits);
  }

  async function handleSubmit() {
    const { id, category } = business;
    const updated_at = new Date();

    await setIsLoading(true);
    await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          id,
          name,
          tagline,
          description,
          business_address: addressObject,
          phone: formatNumberAsDigits(phone),
          email,
          updated_at,
        },
      ]),
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
  }

  return (
    <Card className="size-full flex flex-col">
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
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        <FieldSet>
          <FieldGroup>
            {/* Business name */}
            <Field>
              <FieldLabel htmlFor="business-name">
                Business Name <SettingsWarningIcon />
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

            {/* Address(es) */}
            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <AddressPicker
                input={address}
                setInput={setAddress}
                object={addressObject}
                setObject={setAddressObject}
                disabled={!isEditing || isLoading}
              />
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
                  onChange={(e) =>
                    setPhone(formatPhoneNumberAsString(e.target.value))
                  }
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
