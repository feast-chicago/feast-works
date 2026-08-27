"use client";

import { autoComplete, getPlaceDetails } from "@/actions/google";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Address } from "@/types/feast";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function AddressPicker({
  input,
  setInput,
  object,
  setObject,
  disabled,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  object: Address[];
  setObject: Dispatch<SetStateAction<Address[]>>;
  disabled: boolean;
}) {
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      const predictions = await autoComplete(input);
      setPredictions(predictions ?? []);
    };
    fetchPredictions();
  }, [input]);

  return (
    <div className="w-full relative rounded-none">
      <Command
        className="w-full m-0! p-0! rounded-none!"
        id="business-address"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search an address..."
          value={input}
          onValueChange={setInput}
          onFocus={() => setShowPredictions(true)}
          onBlur={() => setShowPredictions(false)}
          autoComplete="street-address"
          isListDisplayed={showPredictions}
          disabled={disabled}
        />
        <CommandList
          className={`absolute left-0 top-full w-full bg-primary-foreground rounded-b-md ${
            showPredictions && "border-b border-x border-input"
          } shadow-xs z-50`}
        >
          {showPredictions && predictions.length === 0 && (
            <CommandEmpty>
              <span className="text-muted-foreground font-medium select-none">
                {input === ""
                  ? "Start typing to search an address."
                  : "No results found."}
              </span>
            </CommandEmpty>
          )}
          {predictions.length > 0 && showPredictions && (
            <CommandGroup heading="Suggestions">
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  value={prediction.description}
                  onMouseDown={async () => {
                    const { description, place_id } = prediction;

                    setInput(description);
                    setShowPredictions(false);

                    const addressDetails: Address | null =
                      await getPlaceDetails(place_id);
                    if (addressDetails) {
                      setObject([addressDetails]);
                    }
                  }}
                >
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
