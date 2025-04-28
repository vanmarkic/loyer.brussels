/**
 * This file serves as the entry point for accessing data repositories.
 * It exports the currently configured repository implementations.
 *
 * To switch data sources (e.g., from Supabase to Firebase), you would:
 * 1. Create new repository implementations (e.g., app/data/repositories/firebase/address.ts).
 * 2. Update this file to import and export the new implementations instead.
 */

import { addressRepository as supabaseAddressRepository } from "./supabase/address";
import { rentRecordRepository as supabaseRentRecordRepository } from "./supabase/rent-record";

// Export the desired implementations
// Currently configured for Supabase
export const addressRepository = supabaseAddressRepository;
export const rentRecordRepository = supabaseRentRecordRepository;

// You could also export interfaces here if preferred, though consumers
// often import them directly from the interfaces directory.
// export type { IAddressRepository } from '../interfaces/address';
// export type { IRentRecordRepository } from '../interfaces/rent-record';
