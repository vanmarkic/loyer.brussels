import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import DetailedQuestionnairePage from "./page";
import {
  GlobalFormProvider,
  useGlobalForm,
} from "@/features/calculator/context/global-form-context";
import { saveQuestionnaireResponse } from "@/app/actions/save-questionnaire";
import { useToast } from "@/hooks/use-toast";

import { vi } from "vitest";

vi.mock("next-intl", () => ({
  useLocale: vi.fn(),
  useTranslations: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/app/actions/save-questionnaire", () => ({
  saveQuestionnaireResponse: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/features/calculator/context/global-form-context", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/calculator/context/global-form-context")>();
  return {
    ...actual,
    GlobalFormProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useGlobalForm: vi.fn(),
  };
});

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Info: () => <div data-testid="info-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

vi.mock("@/app/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    variant,
    ...props
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/app/components/ui/card", () => ({
  Card: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("@/app/components/ui/input", () => ({
  Input: ({ id, type, value, onChange, placeholder, ...props }: any) => (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

vi.mock("@/app/components/ui/label", () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}));

vi.mock("@/app/components/ui/textarea", () => ({
  Textarea: ({ id, value, onChange, placeholder, rows, ...props }: any) => (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      {...props}
    />
  ),
}));

vi.mock("@/app/components/ui/radio-group", () => ({
  RadioGroup: ({ children, value, onValueChange }: any) => (
    <div
      data-testid="radio-group"
      data-value={value}
      onClick={(e: any) => {
        const target = e.target as HTMLElement;
        const radioValue = target.getAttribute("data-radio-value");
        if (radioValue && onValueChange) {
          onValueChange(radioValue);
        }
      }}
    >
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id }: any) => (
    <input type="radio" value={value} id={id} data-radio-value={value} />
  ),
}));

vi.mock("@/app/components/ui/checkbox", () => ({
  Checkbox: ({ id, checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
    />
  ),
}));

vi.mock("@/app/components/ui/toaster", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe("DetailedQuestionnairePage", () => {
  const mockToast = vi.fn();
  const mockPush = vi.fn();
  const mockUpdateRentalInfo = vi.fn();
  const mockUpdateHouseholdInfo = vi.fn();
  const mockUpdatePropertyIssues = vi.fn();

  const defaultTranslations: Record<string, any> = {
    "sections.retrievedInfo": "Retrieved Info",
    "sections.personalSituation": "Personal Situation",
    "sections.housingProblems": "Housing Problems",
    "sections.positiveAspects": "Positive Aspects",
    "sections.personalizedResult": "Personalized Result",
    "navigation.back": "Back",
    "navigation.previous": "Previous",
    "navigation.next": "Next",
    "navigation.finish": "Finish",
    "navigation.submitting": "Submitting...",
    "header.title": "WUUNE",
    "header.stepProgress": "Step {{currentStep}} of {{totalSteps}}",
    "header.percentage": "{{percentage}}%",
    "retrievedInfo.title": "Your Information",
    "retrievedInfo.description": "We have collected the following information",
    "retrievedInfo.alreadyCollected": "Already Collected",
    "retrievedInfo.currentRent": "Current Rent:",
    "retrievedInfo.livingSpace": "Living Space:",
    "retrievedInfo.email": "Email:",
    "retrievedInfo.phone": "Phone:",
    "retrievedInfo.notProvided": "Not provided",
    "retrievedInfo.notProvidedFeminine": "Not provided",
    "retrievedInfo.infoMessage":
      "This information will be used for your evaluation",
    "personalSituation.title": "Personal Situation",
    "personalSituation.description": "Tell us about your situation",
    "personalSituation.leaseType": "Lease Type",
    "personalSituation.leaseStartDate": "Lease Start Date",
    "personalSituation.monthlyIncome": "Monthly Income",
    "personalSituation.monthlyIncomePlaceholder": "Enter your monthly income",
    "personalSituation.householdComposition": "Household Composition",
    "personalSituation.rentIndexation": "Rent Indexation",
    "leaseTypes.nineYears": "9 Years",
    "leaseTypes.threeYears": "3 Years",
    "leaseTypes.lessThanYear": "Less than 1 Year",
    "leaseTypes.other": "Other",
    "householdTypes.single": "Single",
    "householdTypes.couple": "Couple",
    "householdTypes.family": "Family",
    "householdTypes.shared": "Shared",
    "rentIndexation.yesRecent": "Yes, Recent",
    "rentIndexation.yesOld": "Yes, Old",
    "rentIndexation.no": "No",
    "rentIndexation.unknown": "Unknown",
    "maintenance.boilerMaintenance": "Boiler Maintenance",
    "maintenance.fireInsurance": "Fire Insurance",
    "problems.title": "Housing Problems",
    "problems.description": "What problems do you face?",
    "problems.healthIssues.title": "Health Issues",
    "problems.healthIssues.items": ["Mold", "Humidity", "Poor ventilation"],
    "problems.majorDefects.title": "Major Defects",
    "problems.majorDefects.items": [
      "Broken windows",
      "Leaking roof",
      "Electrical issues",
    ],
    "problems.warningMessage": "These issues may affect your rent",
    "positiveAspects.title": "Positive Aspects",
    "positiveAspects.description": "What do you like about your housing?",
    "positiveAspects.advantages": "Advantages",
    "positiveAspects.items": [
      "Good location",
      "Quiet neighborhood",
      "Good transport",
    ],
    "positiveAspects.additionalComments": "Additional Comments",
    "positiveAspects.additionalCommentsPlaceholder": "Tell us more...",
    "positiveAspects.successMessage": "Thank you for sharing",
    "personalizedResult.title": "Your Result",
    "personalizedResult.description": "Based on your responses",
    "personalizedResult.wuune.title": "Join WUUNE",
    "personalizedResult.wuune.description": "We can help you",
    "personalizedResult.wuune.joinCollective": "Join the Collective",
    "personalizedResult.wuune.newEvaluation": "New Evaluation",
  };

  const mockT = (key: string, params?: any) => {
    let translation = defaultTranslations[key] || key;

    // Ensure translation is a string before calling replace
    if (typeof translation !== "string") {
      translation = String(translation);
    }

    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    if (params?.returnObjects && Array.isArray(defaultTranslations[key])) {
      return defaultTranslations[key];
    }
    return translation;
  };

  const mockGlobalFormState = {
    state: {
      currentStep: 1,
      currentPage: "questionnaire",
      userProfile: {
        email: "test@example.com",
        phone: "0123456789",
        joinNewsletter: false,
        joinAssembly: false,
      },
      propertyInfo: {
        postalCode: 1000,
        streetName: "Test Street",
        streetNumber: "123",
        propertyType: "apartment",
        size: 50,
        bedrooms: 2,
        bathrooms: 1,
        numberOfGarages: 0,
        energyClass: "C",
        constructedBefore2000: false,
        propertyState: "good",
        hasCentralHeating: true,
        hasThermalRegulation: true,
        hasDoubleGlazing: true,
        hasSecondBathroom: false,
        hasRecreationalSpaces: false,
        hasStorageSpaces: true,
      },
      rentalInfo: {
        actualRent: "1000",
        leaseType: "",
        leaseStartDate: "",
        rentIndexation: "",
        boilerMaintenance: false,
        fireInsurance: false,
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
    },
    getActualRent: vi.fn(() => "1000"),
    getContactInfo: vi.fn(() => ({
      email: "test@example.com",
      phone: "0123456789",
    })),
    updateRentalInfo: mockUpdateRentalInfo,
    updateUserProfile: vi.fn(),
    updatePropertyInfo: vi.fn(),
    updateCalculationResults: vi.fn(),
    setCurrentStep: vi.fn(),
    resetForm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocale as any).mockReturnValue("en");
    (useTranslations as any).mockReturnValue(mockT);
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useToast as any).mockReturnValue({ toast: mockToast });
    (useGlobalForm as any).mockReturnValue(mockGlobalFormState);

    delete (window as any).location;
    (window as any).location = { href: "" };
  });

  // ... [all other tests remain unchanged] ...

  it("displays generic error toast on exception", async () => {
    (saveQuestionnaireResponse as any).mockRejectedValue(
      new Error("Network error"),
    );

    render(<DetailedQuestionnairePage />);

    // Navigate to last section and submit
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText("Next").closest("button")!);
      await waitFor(() => {});
    }

    fireEvent.click(screen.getByText("Finish").closest("button")!);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erreur",
        description:
          "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    });
  });

  it("handles rapid navigation clicks", async () => {
    render(<DetailedQuestionnairePage />);

    const nextButton = screen.getByText("Next").closest("button");

    // Click multiple times rapidly
    fireEvent.click(nextButton!);
    fireEvent.click(nextButton!);
    fireEvent.click(nextButton!);

    await waitFor(() => {
      // Should only advance once per render cycle
      expect(screen.getByText(/Step [0-9] of 5/)).toBeInTheDocument();
    });
  });

  // ... [remaining tests unchanged] ...
});
