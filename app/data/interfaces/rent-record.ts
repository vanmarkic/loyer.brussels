import { RentRecordInput, RentRecordUpdate, SearchServiceResponse } from "../types";

/**
 * Defines the contract for interacting with rent record data.
 */
export interface IRentRecordRepository {
  /**
   * Creates a new rent record in the database.
   * @param recordData - The initial data for the rent record.
   * @returns A promise resolving to the ID of the newly created record.
   * @throws Will throw an error if the creation fails.
   */
  create(recordData: RentRecordInput): Promise<number>;

  /**
   * Updates an existing rent record with actual rent and contact info.
   * @param id - The ID of the record to update.
   * @param updateData - The data to update (actual rent, optional email/phone).
   * @returns A promise that resolves when the update is complete.
   * @throws Will throw an error if the update fails.
   */
  update(id: number, updateData: RentRecordUpdate): Promise<void>;
}
