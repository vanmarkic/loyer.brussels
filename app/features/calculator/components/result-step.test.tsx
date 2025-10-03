import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ResultStep } from "./result-step";
import { rentRecordRepository } from "@/app/data/repositories";
import { GlobalFormProvider } from "@/features/calculator/context/global-form-context";

// Mock the global form context
const mockGlobalFormState = {
  currentStep: 4,
  propertyInfo: {
    postalCode: 1000,
    streetName: "Rue de Test",
    streetNumber: "123",
    propertyType: "apartment",
    size: 80,
    bedrooms: 2,
    bathrooms: 1,
    numberOfGarages: 0,
    energyClass: "C",
    constructedBefore2000: false,
    propertyState: 2,
    hasCentralHeating: true,
    hasThermalRegulation: true,
    hasDoubleGlazing: true,
    hasSecondBathroom: false,
    hasRecreationalSpaces: false,
    hasStorageSpaces: true,
  },
  calculationResults: {
    difficultyIndex: 0.5,
    medianRent: 1200,
    minRent: 1000,
    maxRent: 1400,
    isLoading: false,
    error: null,
    errorCode: null,
  },
  userProfile: {
    email: "",
    phone: "",
    joinNewsletter: false,
    joinAssembly: false,
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
};

const mockGlobalFormMethods = {
  updatePropertyInfo: vi.fn(),
  updateUserProfile: vi.fn(),
  updateRentalInfo: vi.fn(),
  updateHouseholdInfo: vi.fn(),
  updatePropertyIssues: vi.fn(),
  updateCalculationResults: vi.fn(),
  setCurrentStep: vi.fn(),
  resetForm: vi.fn(),
  getActualRent: vi.fn(() => ""),
  getContactInfo: vi.fn(() => ({ email: "", phone: "" })),
};

vi.mock("@/features/calculator/context/global-form-context", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/calculator/context/global-form-context")>();
  return {
    ...actual,
    useGlobalForm: () => ({
      state: mockGlobalFormState,
      ...mockGlobalFormMethods,
    }),
    GlobalFormProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock the translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "ResultStep.title": "Votre estimation",
      "ResultStep.description": "Voici le résultat de votre estimation",
      "ResultStep.estimatedRentLabel": "Loyer de référence estimé",
      "ResultStep.priceRangeLabel": "Fourchette de prix",
      "ResultStep.actualRentSection.title": "Votre loyer actuel",
      "ResultStep.actualRentSection.description":
        "Renseignez votre loyer pour comparaison",
      "ResultStep.actualRentSection.rentLabel": "Loyer mensuel (€)",
      "ResultStep.actualRentSection.rentPlaceholder": "Ex: 1200",
      "ResultStep.actualRentSection.emailLabel": "Email (optionnel)",
      "ResultStep.actualRentSection.emailPlaceholder":
        "votre.email@exemple.com",
      "ResultStep.actualRentSection.phoneLabel": "Téléphone (optionnel)",
      "ResultStep.actualRentSection.phonePlaceholder": "Ex: 04XX XX XX XX",
      "ResultStep.actualRentSection.confirmButton": "Confirmer",
      "ResultStep.actualRentSection.updatingButton": "Mise à jour...",
      "ResultStep.actualRentSection.updatedButton": "Mis à jour",
      "ResultStep.actualRentSection.successMessage":
        "Informations enregistrées avec succès",
      "ResultStep.actualRentSection.errorMessage":
        "Erreur lors de la mise à jour",
    };
    return translations[key] || key;
  },
}));

// Mock the rent record repository
vi.mock("@/app/data/repositories", () => ({
  rentRecordRepository: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock the utils functions
vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    cn: (...inputs: (string | undefined)[]) => inputs.filter(Boolean).join(" "),
    propertyTypeLabels: {
      apartment: "Appartement",
      house: "Maison",
      studio: "Studio",
    },
  };
});

// Helper function to render with GlobalFormProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(ui); // GlobalFormProvider is mocked to just return children
};

describe("ResultStep - Phone Input Bug Fix", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful repository operations with a delay to simulate network latency
    vi.mocked(rentRecordRepository.create).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(123), 100)),
    );
    vi.mocked(rentRecordRepository.update).mockResolvedValue(undefined);
  });

  it("should allow typing in phone input field immediately without getting disabled", async () => {
    renderWithProvider(<ResultStep />);

    // Find the phone input field by ID instead of label text
    const phoneInput = screen.getByPlaceholderText(
      /actualRentSection.phonePlaceholder/i,
    );

    // Verify the phone input is not disabled initially (despite recordId being null)
    expect(phoneInput).not.toBeDisabled();

    // Start typing immediately - this should not be interrupted by the field becoming disabled
    await user.type(phoneInput, "0484123456");

    // Verify the value was entered successfully
    expect(phoneInput).toHaveValue("0484123456");

    // Wait a bit to ensure any async operations have time to complete
    await waitFor(
      () => {
        // The field should still not be disabled after any background operations
        expect(phoneInput).not.toBeDisabled();
      },
      { timeout: 200 },
    );

    // Verify we can continue typing
    await user.clear(phoneInput);
    await user.type(phoneInput, "0612345678");
    expect(phoneInput).toHaveValue("0612345678");
  });

  it("should allow typing in email field immediately without getting disabled", async () => {
    renderWithProvider(<ResultStep />);

    const emailInput = screen.getByLabelText(/email/i);

    // Verify the email input is not disabled initially
    expect(emailInput).not.toBeDisabled();

    // Start typing immediately
    await user.type(emailInput, "test@example.com");

    // Verify the value was entered successfully
    expect(emailInput).toHaveValue("test@example.com");

    // Wait and verify the field remains enabled
    await waitFor(
      () => {
        expect(emailInput).not.toBeDisabled();
      },
      { timeout: 200 },
    );
  });

  it("should allow typing in rent input field immediately without getting disabled", async () => {
    renderWithProvider(<ResultStep />);

    const rentInput = screen.getByPlaceholderText(
      /actualRentSection.rentPlaceholder/i,
    );

    // Verify the rent input is not disabled initially
    expect(rentInput).not.toBeDisabled();

    // Start typing immediately
    await user.type(rentInput, "1300");

    // Verify the value was entered successfully
    expect(rentInput).toHaveValue(1300);

    // Wait and verify the field remains enabled
    await waitFor(
      () => {
        expect(rentInput).not.toBeDisabled();
      },
      { timeout: 200 },
    );
  });

  it("should handle form submission when record creation is delayed", async () => {
    // Mock a slower record creation to test the fix
    vi.mocked(rentRecordRepository.create).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(456), 300)),
    );

    renderWithProvider(<ResultStep />);

    // Fill in the form quickly before record creation completes
    const rentInput = screen.getByPlaceholderText(
      /actualRentSection.rentPlaceholder/i,
    );
    const phoneInput = screen.getByPlaceholderText(
      /actualRentSection.phonePlaceholder/i,
    );
    const emailInput = screen.getByPlaceholderText(
      /actualRentSection.emailPlaceholder/i,
    );

    await user.type(rentInput, "1400");
    await user.type(phoneInput, "0487654321");
    await user.type(emailInput, "user@test.com");

    // Find and click the submit button
    const submitButton = screen.getByRole("button", {
      name: /actualRentSection.confirmButton/i,
    });
    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    // Wait for the create operation to complete first
    await waitFor(
      () => {
        expect(rentRecordRepository.create).toHaveBeenCalled();
      },
      { timeout: 500 },
    );

    // Wait for the update to be called with the user data
    await waitFor(
      () => {
        expect(rentRecordRepository.update).toHaveBeenCalledWith(456, {
          actual_rent: 1400,
          email: "user@test.com",
          phone_number: "0487654321",
        });
      },
      { timeout: 1000 },
    );
  });

  it("should disable inputs only when there is an actual error", async () => {
    // Mock a repository error
    vi.mocked(rentRecordRepository.create).mockRejectedValue(
      new Error("Database connection failed"),
    );

    renderWithProvider(<ResultStep />);

    // Initially, inputs should be enabled
    const phoneInput = screen.getByPlaceholderText(
      /actualRentSection.phonePlaceholder/i,
    );
    const emailInput = screen.getByPlaceholderText(
      /actualRentSection.emailPlaceholder/i,
    );
    const rentInput = screen.getByPlaceholderText(
      /actualRentSection.rentPlaceholder/i,
    );

    expect(phoneInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
    expect(rentInput).not.toBeDisabled();

    // Wait for the error to occur and inputs to become disabled
    await waitFor(
      () => {
        // After an error occurs, inputs should become disabled
        expect(phoneInput).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(rentInput).toBeDisabled();
      },
      { timeout: 1000 },
    );
  });
});
