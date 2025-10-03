/**
 * Integration tests for questionnaire submission
 * Tests the complete flow: data collection -> validation -> database -> email
 * @vitest-environment node
 */

import { describe, it, expect, afterAll, vi } from "vitest";
import { saveQuestionnaireResponse } from "../save-questionnaire";
import { supabase, hasSupabaseCredentials } from "@/app/lib/supabase";
import type { GlobalFormState } from "@/app/data/global-form-types";

// Mock the email module to avoid hitting Resend API in tests
vi.mock("@/app/lib/email", () => ({
  sendQuestionnaireConfirmation: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "mock-email-id" },
  }),
  sendContactNotification: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "mock-email-id" },
  }),
  sendContactConfirmation: vi.fn().mockResolvedValue({
    success: true,
    data: { id: "mock-email-id" },
  }),
}));

describe("Questionnaire Integration Tests", () => {
  const testSubmissionIds: string[] = [];
  const testEmail = "drag.markovic@gmail.com";

  // Skip all tests if Supabase credentials are not available
  const skipTests = !hasSupabaseCredentials;

  // Cleanup function to remove test data
  afterAll(async () => {
    if (skipTests) return;
    for (const id of testSubmissionIds) {
      await supabase.from("questionnaire_responses").delete().eq("id", id);
    }
  });

  // Helper function to create a complete test form state
  const createTestFormState = (
    overrides?: Partial<GlobalFormState>,
  ): GlobalFormState => {
    return {
      size: 85,
      currentStep: 5,
      currentPage: "questionnaire",
      userProfile: {
        email: testEmail,
        phone: "+32 123 456 789",
        joinNewsletter: true,
        joinAssembly: true,
      },
      propertyInfo: {
        postalCode: 1000,
        streetName: "Rue de la Loi",
        streetNumber: "16",
        propertyType: "apartment",
        size: 85,
        bedrooms: 2,
        bathrooms: 1,
        numberOfGarages: 0,
        energyClass: "C",
        constructedBefore2000: true,
        propertyState: 2,
        hasCentralHeating: true,
        hasThermalRegulation: false,
        hasDoubleGlazing: true,
        hasSecondBathroom: false,
        hasRecreationalSpaces: false,
        hasStorageSpaces: true,
      },
      rentalInfo: {
        actualRent: "950",
        leaseType: "9-years",
        leaseStartDate: "2020-06-01",
        rentIndexation: "yes-recent",
        boilerMaintenance: true,
        fireInsurance: true,
      },
      householdInfo: {
        monthlyIncome: "2500",
        householdComposition: "couple",
        paymentDelays: "no",
        evictionThreats: "no",
        mediationAttempts: "no",
      },
      propertyIssues: {
        healthIssues: [
          "Humidité excessive ou moisissures",
          "Problèmes de chauffage ou d'isolation",
        ],
        majorDefects: ["Fenêtres ou portes défectueuses"],
        positiveAspects: [
          "Logement récemment rénové",
          "Quartier très bien desservi",
        ],
        additionalComments:
          "Le logement est globalement en bon état mais présente quelques problèmes d'humidité dans la salle de bain.",
      },
      calculationResults: {
        difficultyIndex: 25,
        medianRent: 850,
        minRent: 765,
        maxRent: 935,
        isLoading: false,
        error: null,
        errorCode: null,
      },
      lastUpdated: Date.now(),
      sessionId: `test-session-${Date.now()}`,
      ...overrides,
    };
  };

  describe("saveQuestionnaireResponse", () => {
    it.skipIf(skipTests)(
      "should successfully submit a complete questionnaire",
      async () => {
        const formState = createTestFormState();

        const result = await saveQuestionnaireResponse(formState);

        // Verify successful submission
        expect(result.success).toBe(true);
        expect(result.submissionId).toBeDefined();
        expect(result.error).toBeUndefined();

        // Store ID for cleanup
        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);

          // Verify database entry
          const { data: submission, error } = await supabase
            .from("questionnaire_responses")
            .select("*")
            .eq("id", result.submissionId)
            .single();

          expect(error).toBeNull();
          expect(submission).toBeDefined();

          // Verify user profile data
          expect(submission?.email).toBe(testEmail);
          expect(submission?.phone).toBe(formState.userProfile.phone);
          expect(submission?.join_newsletter).toBe(true);
          expect(submission?.join_assembly).toBe(true);

          // Verify property information
          expect(submission?.postal_code).toBe(1000);
          expect(submission?.street_name).toBe("Rue de la Loi");
          expect(submission?.street_number).toBe("16");
          expect(submission?.property_type).toBe("apartment");
          expect(submission?.living_space).toBe(85);
          expect(submission?.bedrooms).toBe(2);
          expect(submission?.bathrooms).toBe(1);

          // Verify rental information
          expect(submission?.actual_rent).toBe(950);
          expect(submission?.lease_type).toBe("9-years");
          expect(submission?.lease_start_date).toBe("2020-06-01");

          // Verify household information
          expect(submission?.monthly_income).toBe(2500);
          expect(submission?.household_composition).toBe("couple");

          // Verify property issues (JSONB arrays)
          expect(submission?.health_issues).toHaveLength(2);
          expect(submission?.major_defects).toHaveLength(1);
          expect(submission?.positive_aspects).toHaveLength(2);
          expect(submission?.additional_comments).toContain("humidité");

          // Verify calculation results
          expect(submission?.difficulty_index).toBe(25);
          expect(submission?.median_rent).toBe(850);
          expect(submission?.min_rent).toBe(765);
          expect(submission?.max_rent).toBe(935);

          // Verify timestamps
          expect(submission?.submitted_at).toBeDefined();
          expect(submission?.created_at).toBeDefined();
        }
      },
    );

    it.skipIf(skipTests)(
      "should successfully submit with minimal required data",
      async () => {
        const minimalFormState: GlobalFormState = {
          size: 0,
          currentStep: 1,
          currentPage: "questionnaire",
          userProfile: {
            email: testEmail,
            phone: "",
            joinNewsletter: false,
            joinAssembly: false,
          },
          propertyInfo: {
            postalCode: 0,
            streetName: "",
            streetNumber: "",
            propertyType: "",
            size: 0,
            bedrooms: 1,
            bathrooms: 1,
            numberOfGarages: 0,
            energyClass: "",
            constructedBefore2000: null,
            propertyState: null,
            hasCentralHeating: null,
            hasThermalRegulation: null,
            hasDoubleGlazing: null,
            hasSecondBathroom: null,
            hasRecreationalSpaces: null,
            hasStorageSpaces: null,
          },
          rentalInfo: {
            actualRent: "",
            leaseType: "",
            leaseStartDate: "",
            rentIndexation: "",
            boilerMaintenance: false,
            fireInsurance: false,
          },
          householdInfo: {
            monthlyIncome: "",
            householdComposition: "",
            paymentDelays: "",
            evictionThreats: "",
            mediationAttempts: "",
          },
          propertyIssues: {
            healthIssues: [],
            majorDefects: [],
            positiveAspects: [],
            additionalComments: "",
          },
          calculationResults: {
            difficultyIndex: null,
            medianRent: null,
            minRent: null,
            maxRent: null,
            isLoading: false,
            error: null,
            errorCode: null,
          },
          lastUpdated: Date.now(),
          sessionId: `test-minimal-${Date.now()}`,
        };

        const result = await saveQuestionnaireResponse(minimalFormState);

        expect(result.success).toBe(true);
        expect(result.submissionId).toBeDefined();

        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);
        }
      },
    );

    it.skipIf(skipTests)("should reject submission without email", async () => {
      const formState = createTestFormState();
      formState.userProfile.email = "";

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("email requise");
    });

    it.skipIf(skipTests)(
      "should handle high rent overpayment case",
      async () => {
        const formState = createTestFormState({
          rentalInfo: {
            actualRent: "1500", // Much higher than max rent
            leaseType: "9-years",
            leaseStartDate: "2020-01-01",
            rentIndexation: "yes-recent",
            boilerMaintenance: true,
            fireInsurance: true,
          },
          calculationResults: {
            difficultyIndex: 25,
            medianRent: 850,
            minRent: 765,
            maxRent: 935,
            isLoading: false,
            error: null,
            errorCode: null,
          },
        });

        const result = await saveQuestionnaireResponse(formState);

        expect(result.success).toBe(true);

        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);

          const { data: submission } = await supabase
            .from("questionnaire_responses")
            .select("actual_rent, max_rent")
            .eq("id", result.submissionId)
            .single();

          expect(submission?.actual_rent).toBe(1500);
          expect(submission?.max_rent).toBe(935);
          // Overpayment would be 565€
          expect(
            Number(submission?.actual_rent) - Number(submission?.max_rent),
          ).toBe(565);
        }
      },
    );

    it.skipIf(skipTests)(
      "should store complex property issues correctly",
      async () => {
        const formState = createTestFormState({
          propertyIssues: {
            healthIssues: [
              "Humidité excessive ou moisissures",
              "Problèmes de chauffage ou d'isolation",
              "Nuisances sonores importantes",
              "Problèmes d'électricité ou de plomberie",
              "Infestation (rats, cafards, etc.)",
            ],
            majorDefects: [
              "Fenêtres ou portes défectueuses",
              "Revêtements de sol en mauvais état",
              "Peinture écaillée ou papier peint décollé",
            ],
            positiveAspects: [
              "Logement récemment rénové",
              "Balcon, terrasse ou jardin",
              "Parking ou garage inclus",
              "Quartier très bien desservi",
            ],
            additionalComments:
              "Le logement présente de nombreux défauts mais le propriétaire refuse de faire les réparations nécessaires. Cela fait 6 mois que nous attendons.",
          },
        });

        const result = await saveQuestionnaireResponse(formState);

        expect(result.success).toBe(true);

        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);

          const { data: submission } = await supabase
            .from("questionnaire_responses")
            .select(
              "health_issues, major_defects, positive_aspects, additional_comments",
            )
            .eq("id", result.submissionId)
            .single();

          expect(submission?.health_issues).toHaveLength(5);
          expect(submission?.major_defects).toHaveLength(3);
          expect(submission?.positive_aspects).toHaveLength(4);
          expect(submission?.additional_comments).toContain("6 mois");
        }
      },
    );

    it.skipIf(skipTests)(
      "should handle different household compositions",
      async () => {
        const compositions = ["single", "couple", "family", "shared"];

        for (const composition of compositions) {
          const formState = createTestFormState({
            householdInfo: {
              monthlyIncome: "2000",
              householdComposition: composition,
              paymentDelays: "no",
              evictionThreats: "no",
              mediationAttempts: "no",
            },
          });

          const result = await saveQuestionnaireResponse(formState);

          expect(result.success).toBe(true);

          if (result.submissionId) {
            testSubmissionIds.push(result.submissionId);

            const { data: submission } = await supabase
              .from("questionnaire_responses")
              .select("household_composition")
              .eq("id", result.submissionId)
              .single();

            expect(submission?.household_composition).toBe(composition);
          }
        }
      },
    );

    it.skipIf(skipTests)("should store session ID for tracking", async () => {
      const sessionId = `integration-test-${Date.now()}`;
      const formState = createTestFormState({
        sessionId,
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);

      if (result.submissionId) {
        testSubmissionIds.push(result.submissionId);

        const { data: submission } = await supabase
          .from("questionnaire_responses")
          .select("session_id")
          .eq("id", result.submissionId)
          .single();

        expect(submission?.session_id).toBe(sessionId);
      }
    });

    it.skipIf(skipTests)(
      "should handle special characters in text fields",
      async () => {
        const formState = createTestFormState({
          propertyInfo: {
            ...createTestFormState().propertyInfo,
            streetName: "Rue de l'Église & Café",
            streetNumber: "12bis",
          },
          propertyIssues: {
            healthIssues: [],
            majorDefects: [],
            positiveAspects: [],
            additionalComments:
              "Test avec caractères spéciaux: <script>alert('test')</script> & é à ç ñ 中文",
          },
        });

        const result = await saveQuestionnaireResponse(formState);

        expect(result.success).toBe(true);

        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);

          const { data: submission } = await supabase
            .from("questionnaire_responses")
            .select("street_name, street_number, additional_comments")
            .eq("id", result.submissionId)
            .single();

          expect(submission?.street_name).toBe("Rue de l'Église & Café");
          expect(submission?.street_number).toBe("12bis");
          expect(submission?.additional_comments).toContain(
            "caractères spéciaux",
          );
        }
      },
    );
  });

  describe("Email Integration", () => {
    it.skipIf(skipTests)(
      "should call email confirmation function after successful submission",
      async () => {
        const { sendQuestionnaireConfirmation } = await import(
          "@/app/lib/email"
        );
        const formState = createTestFormState();

        const result = await saveQuestionnaireResponse(formState);

        // Should succeed
        expect(result.success).toBe(true);
        expect(result.submissionId).toBeDefined();

        // Verify email function was called
        expect(sendQuestionnaireConfirmation).toHaveBeenCalledWith({
          email: testEmail,
          submissionId: result.submissionId,
          submissionDate: expect.any(String),
        });

        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);
        }
      },
    );
  });

  describe("Data Integrity", () => {
    it.skipIf(skipTests)(
      "should maintain data integrity across all fields",
      async () => {
        const formState = createTestFormState({
          propertyInfo: {
            postalCode: 1050,
            streetName: "Avenue Louise",
            streetNumber: "234",
            propertyType: "house",
            size: 120,
            bedrooms: 3,
            bathrooms: 2,
            numberOfGarages: 1,
            energyClass: "B",
            constructedBefore2000: false,
            propertyState: 3,
            hasCentralHeating: true,
            hasThermalRegulation: true,
            hasDoubleGlazing: true,
            hasSecondBathroom: true,
            hasRecreationalSpaces: true,
            hasStorageSpaces: true,
          },
        });

        const result = await saveQuestionnaireResponse(formState);

        expect(result.success).toBe(true);

        if (result.submissionId) {
          testSubmissionIds.push(result.submissionId);

          const { data: submission } = await supabase
            .from("questionnaire_responses")
            .select("*")
            .eq("id", result.submissionId)
            .single();

          // Verify all boolean fields
          expect(submission?.has_central_heating).toBe(true);
          expect(submission?.has_thermal_regulation).toBe(true);
          expect(submission?.has_double_glazing).toBe(true);
          expect(submission?.has_second_bathroom).toBe(true);
          expect(submission?.has_recreational_spaces).toBe(true);
          expect(submission?.has_storage_spaces).toBe(true);
          expect(submission?.constructed_before_2000).toBe(false);

          // Verify numeric fields
          expect(submission?.living_space).toBe(120);
          expect(submission?.bedrooms).toBe(3);
          expect(submission?.bathrooms).toBe(2);
          expect(submission?.number_of_garages).toBe(1);
        }
      },
    );
  });
});
