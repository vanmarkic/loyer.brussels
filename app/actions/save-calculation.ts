'use server';

import { createAdminClient } from '@/lib/supabase';
import type { CalculatorState, RentCalculationResult, RentComparison } from '@/types/calculator';

export async function saveCalculation(
  state: CalculatorState,
  calculation: RentCalculationResult,
  comparison?: RentComparison | null,
  contactInfo?: { email?: string; phone?: string }
) {
  try {
    const supabase = createAdminClient();

    const data = {
      // Property Type & Details
      housing_type: state.housingType,
      property_type: state.propertyType,
      living_space: state.propertyDetails?.livingSpace,
      bedrooms: state.propertyDetails?.bedrooms,
      bathrooms: state.propertyDetails?.bathrooms,

      // Features
      central_heating: state.features?.centralHeating || false,
      thermal_regulation: state.features?.thermalRegulation || false,
      double_glazing: state.features?.doubleGlazing || false,
      second_bathroom: state.features?.secondBathroom || false,
      recreational_spaces: state.features?.recreationalSpaces || false,
      storage_spaces: state.features?.storageSpaces || false,
      building_before_2000: state.features?.buildingBefore2000 || false,
      garages: state.features?.garages || 0,

      // Energy & Location
      energy_rating: state.energyRating,
      postal_code: state.address?.postalCode,
      street_name: state.address?.streetName,
      building_number: state.address?.buildingNumber,

      // Calculation Results
      minimum_rent: calculation.minimumRent,
      median_rent: calculation.medianRent,
      maximum_rent: calculation.maximumRent,
      difficulty_index: calculation.difficultyIndex,

      // User Rent
      user_rent: state.currentRent,
      comparison_status: comparison?.status,
      rent_difference: comparison?.difference,

      // Contact Info
      email: contactInfo?.email,
      phone: contactInfo?.phone,

      // Metadata
      completed: true,
    };

    const { data: inserted, error } = await supabase
      .from('rent_calculations')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error saving calculation:', error);
      throw new Error('Failed to save calculation');
    }

    return { success: true, id: inserted.id };
  } catch (error) {
    console.error('Error in saveCalculation:', error);
    return { success: false, error: 'Failed to save calculation' };
  }
}
