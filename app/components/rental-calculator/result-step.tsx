"use client";

import { useState, useEffect } from "react";
import { useForm } from "@/app/context/form-context";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed direct supabase import: import { supabase } from "@/app/lib/supabase";
import { rentRecordRepository } from "@/app/data/repositories"; // Import the repository
import type { UserInputs, RentRecordInput, RentRecordUpdate } from "@/app/data/types"; // Import types
import {
  ArrowRight,
  Download,
  Share2,
  Info,
  Calculator,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { propertyTypeLabels } from "@/lib/utils"; // Keep propertyTypeLabels if needed elsewhere, remove handlePDF

export function ResultStep() {
  const { state, dispatch } = useForm();
  const t = useTranslations("ResultStep");
  const tFeatures = useTranslations("FeaturesStep");
  const tDetails = useTranslations("PropertyDetailsStep");
  const [actualRent, setActualRent] = useState<string>("");
  const [recordId, setRecordId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<"idle" | "success" | "error">("idle");
  const [initialInsertError, setInitialInsertError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false); // Add loading state

  const handleReset = () => {
    dispatch({ type: "RESET_FORM" });
  };
  const handleEdit = () => {
    dispatch({ type: "GO_TO_STEP", payload: 1 });
  };

  // Removed: const handleDownloadPdf = handlePDF(state);

  // Async function to handle dynamic import and PDF generation
  const triggerPdfDownload = async () => {
    setIsDownloadingPdf(true);
    try {
      // Dynamically import the handlePDF function
      const { handlePDF } = await import("@/lib/utils");
      // Execute the PDF generation
      handlePDF(state)(); // Call the returned function
    } catch (error) {
      console.error("Error loading or generating PDF:", error);
      // Optionally show an error message to the user
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Helper function to get user inputs from state matching UserInputs type
  const getUserInputs = (): UserInputs => {
    let propertyStateString: string;
    switch (state.propertyState) {
      case 1:
        propertyStateString = "bad";
        break; // Mauvais état
      case 2:
        propertyStateString = "good";
        break; // Bon état
      case 3:
        propertyStateString = "excellent";
        break; // Excellent état
      default:
        propertyStateString = "good"; // Default to 'good' if null or unexpected
    }

    return {
      propertyType: state.propertyType || "studio", // Provide default if empty
      size: state.size || 0,
      bedrooms: state.bedrooms || 0,
      bathrooms: state.bathrooms || 1,
      energyClass: state.energyClass || "G", // Provide default if empty
      hasCentralHeating: state.hasCentralHeating ?? false, // Default to false if null
      hasThermalRegulation: state.hasThermalRegulation ?? false,
      hasDoubleGlazing: state.hasDoubleGlazing ?? false,
      hasSecondBathroom: state.hasSecondBathroom ?? false,
      hasRecreationalSpaces: state.hasRecreationalSpaces ?? false,
      hasStorageSpaces: state.hasStorageSpaces ?? false,
      streetNumber: state.streetNumber || "",
      streetName: state.streetName || "",
      postalCode: state.postalCode || 0,
      difficultyIndex: state.difficultyIndex, // Can be null
      constructedBefore2000: state.constructedBefore2000 ?? false,
      propertyState: propertyStateString, // Assign the mapped string value
      numberOfGarages: state.numberOfGarages || 0,
    };
  };

  // Effect to insert initial record using the repository
  useEffect(() => {
    const insertInitialRecord = async () => {
      if (state.medianRent && !recordId && !initialInsertError) {
        const userInputs = getUserInputs();
        const initialRecord: RentRecordInput = {
          user_inputs: userInputs,
          median_rent: state.medianRent,
          created_at: new Date().toISOString(),
        };

        try {
          console.log("Attempting initial insert via repository:", initialRecord);
          // Use the repository to create the record
          const newId = await rentRecordRepository.create(initialRecord);
          setRecordId(newId);
          console.log("Initial record inserted via repository with ID:", newId);
          setInitialInsertError(null);
        } catch (error) {
          console.error("Error inserting initial rent record via repository:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred during initial insert.";
          setInitialInsertError(errorMessage);
          setRecordId(null);
        }
      }
    };

    insertInitialRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.medianRent, recordId, initialInsertError]); // Dependencies remain similar

  // Function to handle the UPDATE using the repository
  const handleActualRentUpdate = async () => {
    if (!recordId) {
      console.error("Cannot update rent, initial record ID not found or insert failed.");
      setUpdateStatus("error");
      return;
    }

    setIsUpdating(true);
    setUpdateStatus("idle");

    const rentValue = parseFloat(actualRent);
    if (isNaN(rentValue) || rentValue <= 0) {
      console.error("Invalid actual rent value:", actualRent);
      setUpdateStatus("error");
      setIsUpdating(false);
      return;
    }

    try {
      const updateData: RentRecordUpdate = {
        actual_rent: rentValue,
      };
      if (email.trim()) {
        updateData.email = email.trim();
      }
      if (phoneNumber.trim()) {
        updateData.phone_number = phoneNumber.trim();
      }

      console.log(
        `Attempting to update record ID: ${recordId} via repository with data:`,
        updateData
      );
      // Use the repository to update the record
      await rentRecordRepository.update(recordId, updateData);
      console.log(`Record ID: ${recordId} updated successfully via repository.`);
      setUpdateStatus("success");
    } catch (error) {
      console.error("Error updating rent record via repository:", error);
      setUpdateStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- JSX remains largely the same ---
  return (
    <div className="space-y-6">
      {initialInsertError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">{t("initialInsertError.title")}</strong>
          <span className="block sm:inline">
            {" "}
            {t("initialInsertError.message", { error: initialInsertError })}
          </span>
        </div>
      )}
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Card className="bg-gradient-to-r from-[#f18240] to-[#e05c6d] text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium">{t("estimatedRentLabel")}</p>
            <p className="text-5xl font-bold mt-2">{state.medianRent ?? "..."} €</p>
            <div className="flex justify-center items-center mt-2">
              <p className="text-sm opacity-80">
                {t("priceRangeLabel")}: {state.minRent ?? "N/A"} € -{" "}
                {state.maxRent ?? "N/A"}€
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("priceRangeTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actual Rent Input Section */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">{t("actualRentSection.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("actualRentSection.description")}
        </p>
        <div className="space-y-2">
          <Label htmlFor="actualRent">{t("actualRentSection.rentLabel")}</Label>
          <Input
            id="actualRent"
            type="number"
            placeholder={t("actualRentSection.rentPlaceholder")}
            value={actualRent}
            onChange={(e) => setActualRent(e.target.value)}
            disabled={
              isUpdating ||
              updateStatus === "success" ||
              !recordId ||
              !!initialInsertError
            }
            min="0"
            step="1"
          />
        </div>
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("actualRentSection.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("actualRentSection.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={
              isUpdating ||
              updateStatus === "success" ||
              !recordId ||
              !!initialInsertError
            }
          />
        </div>
        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t("actualRentSection.phoneLabel")}</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder={t("actualRentSection.phonePlaceholder")}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={
              isUpdating ||
              updateStatus === "success" ||
              !recordId ||
              !!initialInsertError
            }
          />
        </div>
        <Button
          onClick={handleActualRentUpdate}
          disabled={
            isUpdating ||
            updateStatus === "success" ||
            actualRent.trim() === "" ||
            !recordId ||
            !!initialInsertError
          }
          className="w-full"
        >
          {isUpdating
            ? t("actualRentSection.updatingButton")
            : updateStatus === "success"
            ? t("actualRentSection.updatedButton")
            : t("actualRentSection.confirmButton")}
        </Button>
        {updateStatus === "success" && (
          <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
            <CheckCircle className="h-4 w-4" /> {t("actualRentSection.successMessage")}
          </p>
        )}
        {updateStatus === "error" && (
          <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
            <XCircle className="h-4 w-4" /> {t("actualRentSection.errorMessage")}
          </p>
        )}
      </div>
      {/* End Actual Rent Input Section */}

      {/* Summary Section */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">{t("summary.title")}</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              {t("summary.addressLabel")}
            </h4>
            <p>
              {state.streetNumber} {state.streetName}, {state.postalCode}{" "}
              {t("summary.city")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">{t("summary.propertyTypeLabel")}:</div>
            <div className="font-medium">
              {propertyTypeLabels[state.propertyType || "studio"] || "-"}{" "}
              {/* Handle empty string */}
            </div>
            {/* Removed duplicate address display */}
            <div className="text-muted-foreground">{t("summary.sizeLabel")}:</div>
            <div className="font-medium">{state.size} m²</div>
            <div className="text-muted-foreground">{t("summary.bedroomsLabel")}:</div>
            <div className="font-medium">
              {state.bedrooms === 4 ? tDetails("bedroomsCountMax") : state.bedrooms}
            </div>
            <div className="text-muted-foreground">{t("summary.bathroomsLabel")}:</div>
            <div className="font-medium">{state.bathrooms}</div>
            <div className="text-muted-foreground">{t("summary.energyClassLabel")}:</div>
            <div className="font-medium">{state.energyClass || "-"}</div>{" "}
            {/* Handle empty string */}
            <div className="text-muted-foreground">{t("summary.featuresLabel")}:</div>
            <div className="font-medium">
              {[
                state.hasCentralHeating ? tFeatures("options.centralHeating") : null,
                state.hasThermalRegulation
                  ? tFeatures("options.thermalRegulation")
                  : null,
                state.hasDoubleGlazing ? tFeatures("options.doubleGlazing") : null,
                state.hasSecondBathroom ? tFeatures("options.secondBathroom") : null,
                state.hasRecreationalSpaces
                  ? tFeatures("options.recreationalSpaces")
                  : null,
                state.hasStorageSpaces ? tFeatures("options.storageSpaces") : null,
              ]
                .filter(Boolean)
                .join(", ") || t("summary.featuresNone")}
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Method Section */}
      <div className="bg-blue-50 p-4 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Calculator className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">{t("calculationMethod.title")}</p>
            <p className="mt-1 text-blue-700">{t("calculationMethod.description")}</p>
          </div>
        </div>
      </div>

      {/* Important Info Section */}
      <div className="bg-amber-50 p-4 rounded-lg text-sm">
        <p className="font-medium text-amber-800">{t("importantInfo.title")}</p>
        <p className="mt-1 text-amber-700">{t("importantInfo.description1")}</p>
        <p className="mt-2 text-amber-700">{t("importantInfo.description2")}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={triggerPdfDownload}
            disabled={isDownloadingPdf}
          >
            {isDownloadingPdf ? (
              <span className="animate-spin h-4 w-4 border-b-2 border-current rounded-full inline-block"></span>
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isDownloadingPdf ? t("downloadingPdfButton") : t("downloadPdfButton")}
          </Button>
          <Button variant="outline" className="flex-1 gap-2" disabled={isDownloadingPdf}>
            {" "}
            {/* Optionally disable share too */}
            <Share2 className="h-4 w-4" /> {t("shareButton")}
          </Button>
        </div>
        <Button onClick={handleEdit} className="bg-[#e05c6d] hover:bg-[#d04c5d] gap-2">
          {t("modifyButton")} <ArrowRight className="h-4 w-4" />
        </Button>
        <Button onClick={handleReset} className="bg-[#e05c6d] hover:bg-[#d04c5d] gap-2">
          {t("newEstimationButton")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
