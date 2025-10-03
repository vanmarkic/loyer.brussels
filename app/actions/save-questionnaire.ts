"use server";

import { supabaseAdmin } from "@/app/server/supabase-admin";
import { sendQuestionnaireConfirmation, QuestionnaireEmailData } from "@/app/lib/email";
import type { GlobalFormState } from "@/features/calculator/types/global-form-types";

export interface QuestionnaireSubmissionResult {
  success: boolean;
  error?: string;
  submissionId?: string;
}

/**
 * Server action to save questionnaire response to database
 */
export async function saveQuestionnaireResponse(
  formState: GlobalFormState
): Promise<QuestionnaireSubmissionResult> {
  try {
    // Validate that we have required data
    if (!formState.userProfile.email) {
      return {
        success: false,
        error: "Adresse email requise.",
      };
    }

    // Prepare the data for insertion
    const questionnaireData = {
      // Session info
      session_id: formState.sessionId,
      submitted_at: new Date().toISOString(),

      // User profile
      email: formState.userProfile.email,
      phone: formState.userProfile.phone || null,
      join_newsletter: formState.userProfile.joinNewsletter,
      join_assembly: formState.userProfile.joinAssembly,

      // Property information
      postal_code: formState.propertyInfo.postalCode || null,
      street_name: formState.propertyInfo.streetName || null,
      street_number: formState.propertyInfo.streetNumber || null,
      property_type: formState.propertyInfo.propertyType || null,
      living_space: formState.propertyInfo.size || null,
      bedrooms: formState.propertyInfo.bedrooms || null,
      bathrooms: formState.propertyInfo.bathrooms || null,
      number_of_garages: formState.propertyInfo.numberOfGarages || null,
      energy_class: formState.propertyInfo.energyClass || null,
      constructed_before_2000: formState.propertyInfo.constructedBefore2000,
      property_state: formState.propertyInfo.propertyState,
      has_central_heating: formState.propertyInfo.hasCentralHeating,
      has_thermal_regulation: formState.propertyInfo.hasThermalRegulation,
      has_double_glazing: formState.propertyInfo.hasDoubleGlazing,
      has_second_bathroom: formState.propertyInfo.hasSecondBathroom,
      has_recreational_spaces: formState.propertyInfo.hasRecreationalSpaces,
      has_storage_spaces: formState.propertyInfo.hasStorageSpaces,

      // Rental information
      actual_rent: formState.rentalInfo.actualRent
        ? parseFloat(formState.rentalInfo.actualRent)
        : null,
      lease_type: formState.rentalInfo.leaseType || null,
      lease_start_date: formState.rentalInfo.leaseStartDate || null,
      rent_indexation: formState.rentalInfo.rentIndexation || null,
      boiler_maintenance: formState.rentalInfo.boilerMaintenance,
      fire_insurance: formState.rentalInfo.fireInsurance,

      // Household information
      monthly_income: formState.householdInfo.monthlyIncome
        ? parseFloat(formState.householdInfo.monthlyIncome)
        : null,
      household_composition: formState.householdInfo.householdComposition || null,
      payment_delays: formState.householdInfo.paymentDelays || null,
      eviction_threats: formState.householdInfo.evictionThreats || null,
      mediation_attempts: formState.householdInfo.mediationAttempts || null,

      // Property issues
      health_issues: formState.propertyIssues.healthIssues || [],
      major_defects: formState.propertyIssues.majorDefects || [],
      positive_aspects: formState.propertyIssues.positiveAspects || [],
      additional_comments: formState.propertyIssues.additionalComments || null,

      // Calculation results
      difficulty_index: formState.calculationResults.difficultyIndex,
      median_rent: formState.calculationResults.medianRent,
      min_rent: formState.calculationResults.minRent,
      max_rent: formState.calculationResults.maxRent,
    };

    // Insert into database
    const { data: submission, error: dbError } = await supabaseAdmin
      .from("questionnaire_responses")
      .insert([questionnaireData])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        error: "Erreur lors de l'enregistrement. Veuillez réessayer.",
      };
    }

    // Send confirmation email
    const emailData: QuestionnaireEmailData = {
      email: formState.userProfile.email,
      submissionId: submission.id,
      submissionDate: new Date().toLocaleDateString("fr-BE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const emailResult = await sendQuestionnaireConfirmation(emailData);
    if (!emailResult.success) {
      console.error("Failed to send confirmation email:", emailResult.error);
      // Don't fail the submission if email fails
    }

    return {
      success: true,
      submissionId: submission.id,
    };
  } catch (error) {
    console.error("Error saving questionnaire response:", error);
    return {
      success: false,
      error: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }
}
