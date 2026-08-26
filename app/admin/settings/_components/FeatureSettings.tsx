"use client";

import InfoTooltip from "@/components/InfoTooltip";
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
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Business, Settings } from "@/types/feast";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FeatureSettings({ business }: { business: Business }) {
  const { settings } = business;
  const {
    is_menu_page_enabled,
    is_customer_accounts_enabled,
    is_rewards_enabled,
    is_online_ordering_enabled,
    is_scheduled_ordering_enabled,
    is_group_ordering_enabled,
    is_pos_enabled,
    is_reservations_enabled,
    is_bill_splitting_enabled,
  } = settings;

  // Patron features
  const [isCustomerAccountsEnabled, setIsCustomerAccountsEnabled] = useState(
    is_customer_accounts_enabled,
  );
  const [isRewardsEnabled, setIsRewardsEnabled] = useState(is_rewards_enabled);

  // Ordering features
  const [isOnlineOrderingEnabled, setIsOnlineOrderingEnabled] = useState(
    is_online_ordering_enabled,
  );
  const [isScheduledOrderingEnabled, setIsScheduledOrderingEnabled] = useState(
    is_scheduled_ordering_enabled,
  );
  const [isGroupOrderingEnabled, setIsGroupOrderingEnabled] = useState(
    is_group_ordering_enabled,
  );
  const [isPosEnabled, setIsPosEnabled] = useState(is_pos_enabled);

  // Dining features
  const [isReservationsEnabled, setIsReservationsEnabled] = useState(
    is_reservations_enabled,
  );
  const [isBillSplittingEnabled, setIsBillSplittingEnabled] = useState(
    is_bill_splitting_enabled,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const { id, category } = business;
    const updated_at = new Date();
    const settings: Settings = {
      ...business.settings,
      is_customer_accounts_enabled: isCustomerAccountsEnabled,
      is_rewards_enabled: isRewardsEnabled,
      is_online_ordering_enabled: isOnlineOrderingEnabled,
      is_scheduled_ordering_enabled: isScheduledOrderingEnabled,
      is_group_ordering_enabled: isGroupOrderingEnabled,
      is_pos_enabled: isPosEnabled,
      is_reservations_enabled: isReservationsEnabled,
      is_bill_splitting_enabled: isBillSplittingEnabled,
    };

    await setIsLoading(true);
    await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ id, settings, updated_at }]),
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
    <Card className="size-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Features</CardTitle>
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
          {/* Patrons */}
          <FieldGroup>
            <h3 className="font-secondary text-xl">Patrons</h3>
            <p>Supported languages</p>
            <FieldLabel htmlFor="is_customer_accounts_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Customer accounts</FieldTitle>
                  <FieldDescription>
                    Allow customers to create accounts.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_customer_accounts_enabled"
                  checked={isCustomerAccountsEnabled}
                  onCheckedChange={setIsCustomerAccountsEnabled}
                  disabled={!isEditing || isLoading}
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="is_rewards_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Rewards</FieldTitle>
                  <FieldDescription>
                    Allow customers to earn rewards for their purchases.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_rewards_enabled"
                  checked={isRewardsEnabled}
                  onCheckedChange={setIsRewardsEnabled}
                  disabled={
                    !isEditing || isLoading || !isCustomerAccountsEnabled
                  }
                />
              </Field>
            </FieldLabel>
          </FieldGroup>

          {/* Ordering */}
          <FieldGroup>
            <h3 className="font-secondary text-xl">Ordering</h3>
            <FieldLabel htmlFor="is_online_ordering_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Online ordering{" "}
                    <InfoTooltip text="Menu page must be enabled." />
                  </FieldTitle>
                  <FieldDescription>
                    Allow customers to order ahead of time.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_online_ordering_enabled"
                  checked={isOnlineOrderingEnabled}
                  onCheckedChange={setIsOnlineOrderingEnabled}
                  disabled={!isEditing || isLoading || !is_menu_page_enabled}
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="is_scheduled_ordering_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Scheduled ordering{" "}
                    <InfoTooltip text="Online ordering must be enabled." />
                  </FieldTitle>
                  <FieldDescription>
                    Allow customers to order ahead of time.{" "}
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_scheduled_ordering_enabled"
                  checked={isScheduledOrderingEnabled}
                  onCheckedChange={setIsScheduledOrderingEnabled}
                  disabled={!isEditing || isLoading || !isOnlineOrderingEnabled}
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="is_group_ordering_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Group ordering{" "}
                    <InfoTooltip text="Online ordering must be enabled." />
                  </FieldTitle>
                  <FieldDescription>
                    Allow customers to order in groups.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_group_ordering_enabled"
                  checked={isGroupOrderingEnabled}
                  onCheckedChange={setIsGroupOrderingEnabled}
                  disabled={!isEditing || isLoading || !isOnlineOrderingEnabled}
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="is_pos_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>POS Integration</FieldTitle>
                  <FieldDescription>
                    Integrate your website with your preferred POS system.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_pos_enabled"
                  checked={isPosEnabled}
                  onCheckedChange={setIsPosEnabled}
                  disabled={!isEditing || isLoading}
                />
              </Field>
            </FieldLabel>
          </FieldGroup>

          {/* Dining */}
          <FieldGroup>
            <h3 className="font-secondary text-xl">Dining</h3>
            <FieldLabel htmlFor="is_reservations_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Reservations</FieldTitle>
                  <FieldDescription>
                    Allow customers to reserve a table ahead of time.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_reservations_enabled"
                  checked={isReservationsEnabled}
                  onCheckedChange={setIsReservationsEnabled}
                  disabled={!isEditing || isLoading}
                />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="is_bill_splitting_enabled">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Bill splitting{" "}
                    <InfoTooltip text="Reservations must be enabled." />
                  </FieldTitle>
                  <FieldDescription>
                    Allow customers in the same group or party to split their
                    bill.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="is_bill_splitting_enabled"
                  checked={isBillSplittingEnabled}
                  onCheckedChange={setIsBillSplittingEnabled}
                  disabled={!isEditing || isLoading || !isReservationsEnabled}
                />
              </Field>
            </FieldLabel>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}
