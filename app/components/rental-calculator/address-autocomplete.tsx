"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { searchAddresses, type AddressResult } from "@/app/actions/search-addresses"
import { useDebounce } from "@/app/hooks/use-debounce"

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressResult) => void
  label?: string
  placeholder?: string
}

export function AddressAutocomplete({
  onAddressSelect,
  label = "Adresse",
  placeholder = "Entrez une adresse à Bruxelles...",
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchAddresses = async () => {
      if (debouncedQuery.length < 3) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const addresses = await searchAddresses(debouncedQuery)
        setResults(addresses)
        setIsOpen(addresses.length > 0)
      } catch (error) {
        console.error("Error fetching addresses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [debouncedQuery])

  const handleSelect = (address: AddressResult) => {
    onAddressSelect(address)
    setQuery(`${address.street_name} ${address.street_number}, ${address.postal_code} Bruxelles`)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="address-autocomplete">{label}</Label>
      <div className="relative">
        <Input
          id="address-autocomplete"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.length >= 3) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className="mt-1"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1 text-sm">
            {results.map((address) => (
              <li
                key={`${address.street_name}-${address.street_number}-${address.postal_code}`}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelect(address)}
              >
                <MapPin className="mr-2 h-4 w-4 text-[#f18240]" />
                <span>
                  {address.street_name} {address.street_number}, {address.postal_code} Bruxelles
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
