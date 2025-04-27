"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import { searchAddresses, type AddressResult } from "@/app/actions/search-addresses";
import { useDebounce } from "@/app/hooks/use-debounce";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressResult) => void;
  label?: string;
  placeholder?: string;
}

export function AddressAutocomplete({
  onAddressSelect,
  label = "Adresse",
  placeholder = "Entrez une adresse à Bruxelles...",
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchAddresses(debouncedQuery);

        if (!response.success) {
          setError(response.error || "Erreur lors de la recherche d'adresses");
          setResults([]);
        } else {
          setResults(response.data);
          setIsOpen(response.data.length > 0);

          // Show a message if no results were found
          if (response.data.length === 0 && debouncedQuery.length >= 3) {
            setError("Aucune adresse trouvée. Veuillez essayer une autre recherche.");
          }
        }
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
        setError(`Erreur: ${error.message || "Une erreur s'est produite"}`);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [debouncedQuery]);

  const handleSelect = (address: AddressResult) => {
    onAddressSelect(address);
    setQuery(
      `${address.streetname_fr} ${address.house_number}, ${address.postcode} Bruxelles`
    );
    setIsOpen(false);
    setError(null);
  };

  const handleManualEntry = () => {
    // Create a mock address result for manual entry
    const manualAddress: AddressResult = {
      id: "manual",
      postcode: "",
      streetname_fr: "",
      house_number: "",
      indice_synth_difficulte: 0.5, // Default difficulty index
    };
    onAddressSelect(manualAddress);
    setIsOpen(false);
    setError(null);
  };

  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="address-autocomplete">{label}</Label>
      <div className="relative">
        <Input
          id="address-autocomplete"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 3) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={`mt-1 ${error ? "border-red-300 focus-visible:ring-red-300" : ""}`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            {error.includes("Aucune adresse trouvée") && (
              <button
                onClick={handleManualEntry}
                className="text-xs underline hover:no-underline"
              >
                Saisir manuellement
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!hasSupabaseCredentials && (
        <Alert className="mt-2 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Mode démo: Utilisez l'option "Saisir manuellement" pour entrer une adresse.
          </AlertDescription>
        </Alert>
      )}

      {isOpen && results.length > 0 && (
        <div
          data-testid="address-results-dropdown"
          className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <ul className="max-h-60 overflow-auto py-1 text-sm">
            {results.map((address: any, index: number) => (
              <li
                key={`${address.streetname_fr}-${address.house_number}-${address.postcode}-${index}`}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelect(address)}
              >
                <MapPin className="mr-2 h-4 w-4 text-[#f18240]" />
                <span>
                  {address.streetname_fr} {address.house_number}, {address.postcode}{" "}
                  Bruxelles
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
