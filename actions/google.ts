"use server";

import { Address } from "@/types/feast";
import { AddressType, Client } from "@googlemaps/google-maps-services-js";

const client = new Client();
const key = process.env.GOOGLE_MAPS_API_KEY as string;

export async function autoComplete(input: string) {
  if (!input) return [];

  try {
    const response = await client.placeAutocomplete({ params: { input, key } });
    return response.data.predictions;
  } catch (error) {
    console.error("Error fetching predictions", error);
  }
}

export async function getPlaceDetails(placeId: string) {
  if (!placeId) return null;
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ["address_components", "formatted_address"],
        key,
      },
    });

    const components = response.data.result.address_components || [];

    // Initialize an empty structure for our parsed data
    const parsedAddress: Address = {
      street_number: "",
      street_name: "",
      city: "",
      state: "",
      state_code: "",
      zip_code: "",
      country: "",
      formatted_address: response.data.result.formatted_address || "",
    };

    // Loop through the components and assign them dynamically based on Google's enums
    components.forEach((component) => {
      const types = component.types;

      if (types.includes(AddressType.street_number)) {
        parsedAddress.street_number = component.long_name;
      }
      if (types.includes(AddressType.route)) {
        parsedAddress.street_name = component.long_name;
      }
      if (types.includes(AddressType.locality)) {
        parsedAddress.city = component.long_name;
      }
      // Fallback for cities in areas where 'locality' isn't used
      if (
        !parsedAddress.city &&
        types.includes(AddressType.sublocality_level_1)
      ) {
        parsedAddress.city = component.long_name;
      }
      if (types.includes(AddressType.administrative_area_level_1)) {
        parsedAddress.state = component.long_name; // e.g., "Illinois"
        parsedAddress.state_code = component.short_name; // e.g., "IL"
      }
      if (types.includes(AddressType.postal_code)) {
        parsedAddress.zip_code = component.long_name;
      }
      if (types.includes(AddressType.country)) {
        parsedAddress.country = component.long_name;
      }
    });

    return parsedAddress;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}
