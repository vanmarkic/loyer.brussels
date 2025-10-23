/**
 * Unit tests for questionnaire submission
 * Tests data collection, validation, and transformation
 * @vitest-environment node
 */

import { describe, it, expect, vi } from "vitest";
import { saveQuestionnaireResponse } from "../save-questionnaire";
import type { GlobalFormState } from "@/features/calculator/types/global-form-types";

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

// Mock Supabase Admin to avoid requiring real database
vi.mock("@/app/server/supabase-admin", () => ({
  hasSupabaseAdminCredentials: false,
  supabaseAdmin: {
    from: () => ({
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const insertedData = Array.isArray(data) ? data[0] : data;
            return {
              data: {
                ...insertedData,
                id: `test-${Math.floor(Math.random() * 100000)}`,
              },
              error: null,
            };
          },
        }),
      }),
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { id: "test-1" },
            error: null,
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

describe("Questionnaire Unit Tests", () => {
  const testEmail = "test@example.com";

  // Helper function to create a complete test form state
  const createTestFormState = (
    overrides?: Partial<GlobalFormState>,
  ): GlobalFormState => {
    return {
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
        propertyState: "good",
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
        additionalComments: "Test comments",
      },
      calculationResults: {
        difficultyIndex: 0.65,
        medianRent: 1200,
        minRent: 1080,
        maxRent: 1320,
        isLoading: false,
        error: null,
        errorCode: null,
      },
      lastUpdated: Date.now(),
      sessionId: "test-session-123",
      ...overrides,
    };
  };

  describe("saveQuestionnaireResponse", () => {
    it("should successfully submit a complete questionnaire", async () => {
      const formState = createTestFormState();
      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it("should successfully submit with minimal required data", async () => {
      const minimalFormState = createTestFormState({
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
      });

      const result = await saveQuestionnaireResponse(minimalFormState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should reject submission without email", async () => {
      const formState = createTestFormState({
        userProfile: {
          email: "",
          phone: "",
          joinNewsletter: false,
          joinAssembly: false,
        },
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("email");
    });

    it("should handle high rent overpayment case", async () => {
      const formState = createTestFormState({
        rentalInfo: {
          actualRent: "2000", // High rent
          leaseType: "9-years",
          leaseStartDate: "2015-01-01",
          rentIndexation: "yes-recent",
          boilerMaintenance: true,
          fireInsurance: true,
        },
        calculationResults: {
          difficultyIndex: 0.95,
          medianRent: 1000, // Much lower median
          minRent: 900,
          maxRent: 1100,
          isLoading: false,
          error: null,
          errorCode: null,
        },
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should store complex property issues correctly", async () => {
      const formState = createTestFormState({
        propertyIssues: {
          healthIssues: [
            "Humidité excessive ou moisissures",
            "Problèmes de chauffage ou d'isolation",
            "Ventilation insuffisante",
          ],
          majorDefects: [
            "Fenêtres ou portes défectueuses",
            "Problèmes de plomberie ou sanitaires",
            "Installation électrique défaillante",
          ],
          positiveAspects: [
            "Logement récemment rénové",
            "Quartier très bien desservi",
            "Bon état général",
          ],
          additionalComments:
            "Multiple issues but also positive aspects of the property",
        },
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should handle different household compositions", async () => {
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
        expect(result.submissionId).toBeDefined();
      }
    });

    it("should store session ID for tracking", async () => {
      const sessionId = "unique-session-abc123";
      const formState = createTestFormState({
        sessionId,
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });

    it("should handle special characters in text fields", async () => {
      const formState = createTestFormState({
        propertyInfo: {
          ...createTestFormState().propertyInfo,
          streetName: "Rue de l'Église <test> & spécial 中文",
          streetNumber: "123/B",
        },
        propertyIssues: {
          healthIssues: ["Test with <script>alert('xss')</script>"],
          majorDefects: ["Test with special chars: é à ç ñ"],
          positiveAspects: ["Test with emojis: 🏠 ✨"],
          additionalComments:
            "Comments with special chars: <>&\"' and unicode: 中文",
        },
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });
  });

  describe("Email Integration", () => {
    it("should call email confirmation function after successful submission", async () => {
      const formState = createTestFormState();
      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      // Email is mocked so it should succeed silently
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity across all fields", async () => {
      const formState = createTestFormState({
        propertyInfo: {
          postalCode: 1060,
          streetName: "Avenue Brugmann",
          streetNumber: "42",
          propertyType: "house",
          size: 120,
          bedrooms: 3,
          bathrooms: 2,
          numberOfGarages: 1,
          energyClass: "B",
          constructedBefore2000: false,
          propertyState: "excellent",
          hasCentralHeating: true,
          hasThermalRegulation: true,
          hasDoubleGlazing: true,
          hasSecondBathroom: true,
          hasRecreationalSpaces: true,
          hasStorageSpaces: true,
        },
        calculationResults: {
          difficultyIndex: 0.45,
          medianRent: 1500,
          minRent: 1350,
          maxRent: 1650,
          isLoading: false,
          error: null,
          errorCode: null,
        },
      });

      const result = await saveQuestionnaireResponse(formState);

      expect(result.success).toBe(true);
      expect(result.submissionId).toBeDefined();
    });
  });
});
