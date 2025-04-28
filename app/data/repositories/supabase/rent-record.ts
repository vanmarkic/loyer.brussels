import { supabase } from "@/app/lib/supabase";
import { IRentRecordRepository } from "../../interfaces/rent-record";
import { RentRecordInput, RentRecordUpdate } from "../../types";

export class SupabaseRentRecordRepository implements IRentRecordRepository {
  /**
   * Creates a new rent record in the Supabase database.
   * @param recordData - The initial data for the rent record.
   * @returns A promise resolving to the ID of the newly created record.
   * @throws Will throw an error if the Supabase insert operation fails or no ID is returned.
   */
  async create(recordData: RentRecordInput): Promise<number> {
    try {
      console.log("Attempting Supabase insert:", recordData);
      const { data, error } = await supabase
        .from("rent_records")
        .insert([recordData]) // Ensure it's an array for insert
        .select("id")
        .single(); // Expecting a single object with the id

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Supabase insert failed: ${error.message}`);
      }

      if (data && data.id) {
        console.log("Supabase record inserted with ID:", data.id);
        return data.id;
      } else {
        console.error("Failed to retrieve ID after Supabase insert, data:", data);
        throw new Error("Failed to retrieve ID after Supabase insert.");
      }
    } catch (error) {
      console.error("Error in RentRecordRepository.create:", error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Updates an existing rent record in the Supabase database.
   * @param id - The ID of the record to update.
   * @param updateData - The data to update (actual rent, optional email/phone).
   * @returns A promise that resolves when the update is complete.
   * @throws Will throw an error if the Supabase update operation fails.
   */
  async update(id: number, updateData: RentRecordUpdate): Promise<void> {
    try {
      console.log(
        `Attempting Supabase update for record ID: ${id} with data:`,
        updateData
      );
      const { error } = await supabase
        .from("rent_records")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Supabase update error:", error);
        throw new Error(`Supabase update failed: ${error.message}`);
      }
      console.log(`Supabase record ID: ${id} updated successfully.`);
    } catch (error) {
      console.error("Error in RentRecordRepository.update:", error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}

// Export an instance of the repository
export const rentRecordRepository = new SupabaseRentRecordRepository();
