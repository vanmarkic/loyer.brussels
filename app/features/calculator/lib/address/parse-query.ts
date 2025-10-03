/**
 * Address query parsing utilities
 * Extracted from SupabaseAddressRepository for reuse
 */

export interface ParsedAddressQuery {
  postalCode: string | null;
  houseNumber: string | null;
  streetQuery: string;
}

/**
 * Parses an address query string to extract postal code, house number, and street name
 * @param query - The raw address query string
 * @returns ParsedAddressQuery with extracted components
 */
export function parseAddressQuery(query: string): ParsedAddressQuery {
  const cleanedQuery = query.trim();
  let postalCode: string | null = null;
  let houseNumber: string | null = null;
  let streetQuery: string = "";

  const postalCodeRegex = /\b(1\d{3})\b/;
  const houseNumberRegex = /\b(\d+[a-zA-Z]*)\b/g;

  const postalCodeMatch = cleanedQuery.match(postalCodeRegex);
  if (postalCodeMatch) {
    postalCode = postalCodeMatch[1];
  }

  const potentialHouseNumbers = [...cleanedQuery.matchAll(houseNumberRegex)]
    .map((m) => m[1])
    .filter((num) => num !== postalCode);
  if (potentialHouseNumbers.length > 0) {
    houseNumber = potentialHouseNumbers[0];
  }

  let remainingQuery = cleanedQuery;
  if (postalCode) {
    remainingQuery = remainingQuery.replace(postalCode, "");
  }
  if (houseNumber) {
    remainingQuery = remainingQuery.replace(houseNumber, "");
  }
  streetQuery = remainingQuery.replace(/\s+/g, " ").trim();

  return {
    postalCode,
    houseNumber,
    streetQuery,
  };
}
