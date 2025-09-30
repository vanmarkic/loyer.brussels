"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale, useTranslations } from "next-intl";
import {
  GlobalFormProvider,
  useGlobalForm,
} from "../../../../context/global-form-context";
import { saveQuestionnaireResponse } from "@/app/actions/save-questionnaire";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface QuestionnaireData {
  // Note: rentAmount and livingSpace are now pulled from global context
  // Section 1: Situation personnelle et du bail
  leaseType: string;
  leaseStartDate: string;
  monthlyIncome: string;
  householdComposition: string;
  rentIndexation: string;
  paymentDelays: string;
  evictionThreats: string;
  mediationAttempts: string;
  boilerMaintenance: boolean;
  fireInsurance: boolean;

  // Section 2: Problèmes du logement
  healthIssues: string[];
  majorDefects: string[];

  // Section 3: Points positifs
  positiveAspects: string[];

  // Commentaires libres
  additionalComments: string;
}

function DetailedQuestionnaireContent() {
  const currentLocale = useLocale();
  const globalForm = useGlobalForm();
  const t = useTranslations("QuestionnairePage");
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get pre-filled data from global context
  const existingRent = globalForm.getActualRent();
  const existingSpace = globalForm.getLivingSpace();
  const contactInfo = globalForm.getContactInfo();

  // Extract update functions (these are stable from useCallback in context)
  const { updateRentalInfo, updateHouseholdInfo, updatePropertyIssues } = globalForm;

  const [data, setData] = useState<QuestionnaireData>({
    leaseType: globalForm.state.rentalInfo.leaseType || "",
    leaseStartDate: globalForm.state.rentalInfo.leaseStartDate || "",
    monthlyIncome: globalForm.state.householdInfo.monthlyIncome || "",
    householdComposition: globalForm.state.householdInfo.householdComposition || "",
    rentIndexation: globalForm.state.rentalInfo.rentIndexation || "",
    paymentDelays: globalForm.state.householdInfo.paymentDelays || "",
    evictionThreats: globalForm.state.householdInfo.evictionThreats || "",
    mediationAttempts: globalForm.state.householdInfo.mediationAttempts || "",
    boilerMaintenance: globalForm.state.rentalInfo.boilerMaintenance,
    fireInsurance: globalForm.state.rentalInfo.fireInsurance,
    healthIssues: globalForm.state.propertyIssues.healthIssues || [],
    majorDefects: globalForm.state.propertyIssues.majorDefects || [],
    positiveAspects: globalForm.state.propertyIssues.positiveAspects || [],
    additionalComments: globalForm.state.propertyIssues.additionalComments || "",
  });

  // Helper function to update both local and global state
  const updateData = useCallback((updates: Partial<QuestionnaireData>) => {
    setData((prev: QuestionnaireData) => {
      const newData = { ...prev, ...updates };
      
      // Update global context with the new data
      updateRentalInfo({
        leaseType: newData.leaseType,
        leaseStartDate: newData.leaseStartDate,
        rentIndexation: newData.rentIndexation,
        boilerMaintenance: newData.boilerMaintenance,
        fireInsurance: newData.fireInsurance,
      });

      updateHouseholdInfo({
        monthlyIncome: newData.monthlyIncome,
        householdComposition: newData.householdComposition,
        paymentDelays: newData.paymentDelays,
        evictionThreats: newData.evictionThreats,
        mediationAttempts: newData.mediationAttempts,
      });

      updatePropertyIssues({
        healthIssues: newData.healthIssues,
        majorDefects: newData.majorDefects,
        positiveAspects: newData.positiveAspects,
        additionalComments: newData.additionalComments,
      });
      
      return newData;
    });
  }, [updateRentalInfo, updateHouseholdInfo, updatePropertyIssues]);

  const sections = [
    t("sections.retrievedInfo"),
    t("sections.personalSituation"),
    t("sections.housingProblems"),
    t("sections.positiveAspects"),
    t("sections.personalizedResult"),
  ];

  const handleNext = async () => {
    // If we're on the last section, save the questionnaire
    if (currentSection === sections.length - 1) {
      await handleSubmitQuestionnaire();
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmitQuestionnaire = async () => {
    setIsSubmitting(true);

    try {
      const result = await saveQuestionnaireResponse(globalForm.state);

      if (result.success) {
        toast({
          title: "Questionnaire soumis !",
          description:
            "Vos réponses ont été enregistrées avec succès. Nous vous contacterons bientôt.",
          duration: 5000,
        });

        // Wait a bit before redirecting to contact page
        setTimeout(() => {
          window.location.href = `/${currentLocale}/contact?join=true`;
        }, 2000);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCheckboxChange = useCallback((
    field: keyof QuestionnaireData,
    value: string,
    checked: boolean
  ) => {
    const currentArray = data[field] as string[];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    
    updateData({ [field]: newArray });
  }, [data, updateData]);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("retrievedInfo.title")}
              </h2>
              <p className="text-gray-600">{t("retrievedInfo.description")}</p>
            </div>

            {/* Show pre-filled data */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="font-semibold text-green-800 mb-3">
                {t("retrievedInfo.alreadyCollected")}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-medium">
                    {t("retrievedInfo.currentRent")}
                  </span>
                  <span className="ml-2">
                    {existingRent
                      ? `${existingRent}€/mois`
                      : t("retrievedInfo.notProvided")}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">
                    {t("retrievedInfo.livingSpace")}
                  </span>
                  <span className="ml-2">
                    {existingSpace
                      ? `${existingSpace}m²`
                      : t("retrievedInfo.notProvidedFeminine")}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">
                    {t("retrievedInfo.email")}
                  </span>
                  <span className="ml-2">
                    {contactInfo.email || t("retrievedInfo.notProvided")}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">
                    {t("retrievedInfo.phone")}
                  </span>
                  <span className="ml-2">
                    {contactInfo.phone || t("retrievedInfo.notProvided")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800">
                <Info className="h-4 w-4 inline mr-2" />
                {t("retrievedInfo.infoMessage")}
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("personalSituation.title")}
              </h2>
              <p className="text-gray-600">{t("personalSituation.description")}</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>{t("personalSituation.leaseType")}</Label>
                <RadioGroup
                  value={data.leaseType}
                  onValueChange={(value) =>
                    updateData({ leaseType: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9-years" id="9-years" />
                    <label htmlFor="9-years">{t("leaseTypes.nineYears")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-years" id="3-years" />
                    <label htmlFor="3-years">{t("leaseTypes.threeYears")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-year" id="1-year" />
                    <label htmlFor="1-year">{t("leaseTypes.lessThanYear")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <label htmlFor="other">{t("leaseTypes.other")}</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="leaseStartDate">
                  {t("personalSituation.leaseStartDate")}
                </Label>
                <Input
                  id="leaseStartDate"
                  type="date"
                  value={data.leaseStartDate}
                  onChange={(e) =>
                    updateData({ leaseStartDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">
                  {t("personalSituation.monthlyIncome")}
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder={t("personalSituation.monthlyIncomePlaceholder")}
                  value={data.monthlyIncome}
                  onChange={(e) =>
                    updateData({ monthlyIncome: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>{t("personalSituation.householdComposition")}</Label>
                <RadioGroup
                  value={data.householdComposition}
                  onValueChange={(value) =>
                    updateData({ householdComposition: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <label htmlFor="single">{t("householdTypes.single")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="couple" id="couple" />
                    <label htmlFor="couple">{t("householdTypes.couple")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family" id="family" />
                    <label htmlFor="family">{t("householdTypes.family")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shared" id="shared" />
                    <label htmlFor="shared">{t("householdTypes.shared")}</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>{t("personalSituation.rentIndexation")}</Label>
                <RadioGroup
                  value={data.rentIndexation}
                  onValueChange={(value) =>
                    updateData({ rentIndexation: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-recent" id="yes-recent" />
                    <label htmlFor="yes-recent">{t("rentIndexation.yesRecent")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-old" id="yes-old" />
                    <label htmlFor="yes-old">{t("rentIndexation.yesOld")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <label htmlFor="no">{t("rentIndexation.no")}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="unknown" />
                    <label htmlFor="unknown">{t("rentIndexation.unknown")}</label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="boilerMaintenance"
                    checked={data.boilerMaintenance}
                    onCheckedChange={(checked) =>
                      updateData({ boilerMaintenance: checked as boolean })
                    }
                  />
                  <label htmlFor="boilerMaintenance" className="text-sm">
                    {t("maintenance.boilerMaintenance")}
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fireInsurance"
                    checked={data.fireInsurance}
                    onCheckedChange={(checked) =>
                      updateData({ fireInsurance: checked as boolean })
                    }
                  />
                  <label htmlFor="fireInsurance" className="text-sm">
                    {t("maintenance.fireInsurance")}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("problems.title")}
              </h2>
              <p className="text-gray-600">{t("problems.description")}</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">
                  {t("problems.healthIssues.title")}
                </Label>
                <div className="space-y-2 mt-2">
                  {(
                    t("problems.healthIssues.items", {
                      returnObjects: true,
                    }) as unknown as string[]
                  ).map((issue: string) => (
                    <div key={issue} className="flex items-center space-x-2">
                      <Checkbox
                        id={issue}
                        checked={data.healthIssues.includes(issue)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("healthIssues", issue, checked as boolean)
                        }
                      />
                      <label htmlFor={issue} className="text-sm">
                        {issue}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">
                  {t("problems.majorDefects.title")}
                </Label>
                <div className="space-y-2 mt-2">
                  {(
                    t("problems.majorDefects.items", {
                      returnObjects: true,
                    }) as unknown as string[]
                  ).map((defect: string) => (
                    <div key={defect} className="flex items-center space-x-2">
                      <Checkbox
                        id={defect}
                        checked={data.majorDefects.includes(defect)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("majorDefects", defect, checked as boolean)
                        }
                      />
                      <label htmlFor={defect} className="text-sm">
                        {defect}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <p className="text-sm text-orange-800">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {t("problems.warningMessage")}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("positiveAspects.title")}
              </h2>
              <p className="text-gray-600">{t("positiveAspects.description")}</p>
            </div>

            <div>
              <Label className="text-lg font-semibold">
                {t("positiveAspects.advantages")}
              </Label>
              <div className="space-y-2 mt-2">
                {(
                  t("positiveAspects.items", {
                    returnObjects: true,
                  }) as unknown as string[]
                ).map((aspect: string) => (
                  <div key={aspect} className="flex items-center space-x-2">
                    <Checkbox
                      id={aspect}
                      checked={data.positiveAspects.includes(aspect)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "positiveAspects",
                          aspect,
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor={aspect} className="text-sm">
                      {aspect}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalComments">
                {t("positiveAspects.additionalComments")}
              </Label>
                <Textarea
                id="additionalComments"
                placeholder={t("positiveAspects.additionalCommentsPlaceholder")}
                value={data.additionalComments}
                onChange={(e) =>
                  updateData({ additionalComments: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <p className="text-sm text-green-800">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                {t("positiveAspects.successMessage")}
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("personalizedResult.title")}
              </h2>
              <p className="text-gray-600">{t("personalizedResult.description")}</p>
            </div>

            {/* Ici on afficherait le résultat personnalisé */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("personalizedResult.wuune.title")}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t("personalizedResult.wuune.description")}
                </p>
                <div className="space-y-4">
                  <Link href={`/${currentLocale}/contact`}>
                    <Button className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 w-full">
                      {t("personalizedResult.wuune.joinCollective")}
                    </Button>
                  </Link>
                  <Link href={`/${currentLocale}/calculateur`}>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 w-full"
                    >
                      {t("personalizedResult.wuune.newEvaluation")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/${currentLocale}/calculateur/bruxelles`}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t("navigation.back")}</span>
              </Link>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-600" />
                <span className="font-bold text-xl">{t("header.title")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Progress bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                {t("header.stepProgress", {
                  currentStep: currentSection + 1,
                  totalSteps: sections.length,
                })}
              </span>
              <span>
                {t("header.percentage", {
                  percentage: Math.round(((currentSection + 1) / sections.length) * 100),
                })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-medium text-gray-700">
                {sections[currentSection]}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                {renderSection()}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSection === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("navigation.previous")}
                  </Button>

                  {currentSection < sections.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                    >
                      {t("navigation.next")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuestionnaire}
                      disabled={isSubmitting}
                      className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t("navigation.submitting") || "Envoi en cours..."}
                        </>
                      ) : (
                        t("navigation.finish")
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

// Wrapper component with GlobalFormProvider
export default function DetailedQuestionnairePage() {
  return (
    <GlobalFormProvider>
      <DetailedQuestionnaireContent />
    </GlobalFormProvider>
  );
}
