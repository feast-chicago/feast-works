"use client";

import { Business } from "@/types/feast";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type UseBusinessReturn = {
  business: Business | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
};

export function useBusiness(): UseBusinessReturn {
  const { user, isLoaded } = useUser();
  const [business, setBusiness] = useState<Business | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchBusiness = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const businesses = user?.publicMetadata?.businesses ?? [];

        if (businesses.length === 0) {
          setError("No business associated with this account.");
          return;
        }

        // TODO: Change this to be an active org switcher
        const { id, role } = businesses[0];

        const res = await fetch(`/api/businesses?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch business.");

        const data: Business = await res.json();
        setBusiness(data);
        setRole(role);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setBusiness(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusiness();
  }, [isLoaded, user]);

  return { business, role, isLoading, error };
}
