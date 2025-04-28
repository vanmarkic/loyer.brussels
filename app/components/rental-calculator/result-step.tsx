"use client";

import { useState, useEffect } from "react"; // Added useState, useEffect
import { useForm } from "@/app/context/form-context";
import { useTranslations } from "next-intl"; // Add this import
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Added Input
import { Label } from "@/components/ui/label"; // Added Label
import { supabase } from "@/app/lib/supabase"; // Added supabase client
import {
  ArrowRight,
  Download,
  Share2,
  Info,
  Calculator,
  CheckCircle,
  XCircle,
} from "lucide-react"; // Added icons

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handlePDF, propertyTypeLabels } from "@/lib/utils";

export function ResultStep() {
  const { state, dispatch } = useForm();
  const t = useTranslations("ResultStep"); // Add this hook
  const tFeatures = useTranslations("FeaturesStep"); // Hook for feature names
  const tDetails = useTranslations("PropertyDetailsStep"); // Hook for bedroom count max
  const [actualRent, setActualRent] = useState<string>("");
  const [recordId, setRecordId] = useState<number | null>(null); // State for record ID
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // State for update operation
  const [updateStatus, setUpdateStatus] = useState<"idle" | "success" | "error">("idle"); // State for update status
  const [initialInsertError, setInitialInsertError] = useState<string | null>(null); // State for initial insert error
  const [email, setEmail] = useState<string>(""); // State for email
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // State for phone number

  const handleReset = () => {
    dispatch({ type: "RESET_FORM" });
  };
  const handleEdit = () => {
    dispatch({ type: "GO_TO_STEP", payload: 1 });
  };

  // Generates a dynamic formula string in French based on used constants and variables

  const handleDownloadPdf = handlePDF(state); // Keep only one declaration

  // Helper function to get user inputs from state
  const getUserInputs = () => ({
    propertyType: state.propertyType,
    size: state.size,
    bedrooms: state.bedrooms,
    bathrooms: state.bathrooms,
    energyClass: state.energyClass,
    hasCentralHeating: state.hasCentralHeating,
    hasThermalRegulation: state.hasThermalRegulation,
    hasDoubleGlazing: state.hasDoubleGlazing,
    hasSecondBathroom: state.hasSecondBathroom,
    hasRecreationalSpaces: state.hasRecreationalSpaces,
    hasStorageSpaces: state.hasStorageSpaces,
    streetNumber: state.streetNumber,
    streetName: state.streetName,
    postalCode: state.postalCode,
    difficultyIndex: state.difficultyIndex,
    // Add other relevant fields from FormState here if needed
    constructedBefore2000: state.constructedBefore2000,
    propertyState: state.propertyState,
    numberOfGarages: state.numberOfGarages,
  });

  // Effect to insert initial record when component mounts and rent is estimated
  useEffect(() => {
    const insertInitialRecord = async () => {
      // Only run if medianRent is available, we don't have an ID yet, and no previous error occurred
      if (state.medianRent && !recordId && !initialInsertError) {
        // Use medianRent
        const userInputs = getUserInputs();
        const initialRecord = {
          user_inputs: userInputs,
          median_rent: state.medianRent, // Use medianRent
          created_at: new Date().toISOString(),
          // actual_rent is initially null or omitted
        };

        try {
          console.log("Attempting initial insert:", initialRecord);
          // Insert and select the id of the new record
          const { data, error } = await supabase
            .from("rent_records")
            .insert([initialRecord])
            .select("id")
            .single(); // Use single() to get the object directly

          if (error) {
            console.error("Supabase insert error:", error);
            throw error;
          }

          if (data && data.id) {
            setRecordId(data.id); // Store the returned ID
            console.log("Initial record inserted with ID:", data.id);
            setInitialInsertError(null); // Clear any previous error state on success
          } else {
            console.error("Failed to retrieve ID after insert, data:", data);
            throw new Error("Failed to retrieve ID after insert.");
          }
        } catch (error) {
          console.error("Error inserting initial rent record:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred during initial insert.";
          setInitialInsertError(errorMessage);
          setRecordId(null); // Ensure recordId is null on error
        }
      }
    };

    insertInitialRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.medianRent, recordId, initialInsertError]); // Dependencies: Use medianRent

  // Function to handle the UPDATE of actual rent
  const handleActualRentUpdate = async () => {
    if (!recordId) {
      console.error("Cannot update rent, initial record ID not found or insert failed.");
      setUpdateStatus("error"); // Show error if no record ID
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
      const updateData: { actual_rent: number; email?: string; phone_number?: string } = {
        actual_rent: rentValue,
      };
      if (email.trim()) {
        updateData.email = email.trim();
      }
      if (phoneNumber.trim()) {
        updateData.phone_number = phoneNumber.trim();
      }

      console.log(`Attempting to update record ID: ${recordId} with data:`, updateData);
      const { error } = await supabase
        .from("rent_records")
        .update(updateData) // Update with actual_rent, email, and phone_number
        .eq("id", recordId); // Match the specific record ID

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      console.log(`Record ID: ${recordId} updated successfully.`);
      setUpdateStatus("success");
    } catch (error) {
      console.error("Error updating rent record:", error);
      setUpdateStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {initialInsertError && ( // Display error if initial insert failed
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
            {/* Use medianRent */}
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
            } // Disable if updating, success, no recordId, or initial error
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
          onClick={handleActualRentUpdate} // Use the update handler
          disabled={
            isUpdating ||
            updateStatus === "success" ||
            actualRent.trim() === "" ||
            !recordId || // Also disable if recordId is missing
            !!initialInsertError // Or if initial insert failed
          }
          className="w-full"
        >
          {isUpdating // Use isUpdating state
            ? t("actualRentSection.updatingButton")
            : updateStatus === "success" // Use updateStatus state
            ? t("actualRentSection.updatedButton")
            : t("actualRentSection.confirmButton")}
        </Button>
        {updateStatus === "success" && ( // Use updateStatus state
          <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
            <CheckCircle className="h-4 w-4" /> {t("actualRentSection.successMessage")}
          </p>
        )}
        {updateStatus === "error" && ( // Use updateStatus state
          <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
            <XCircle className="h-4 w-4" /> {t("actualRentSection.errorMessage")}
          </p>
        )}
      </div>
      {/* End Actual Rent Input Section */}

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
              {propertyTypeLabels[state.propertyType] || "-"}
            </div>

            <div className="text-muted-foreground">{t("summary.addressLabel")}:</div>
            <div className="font-medium">
              {state.streetNumber} {state.streetName}, {state.postalCode}{" "}
              {t("summary.city")}
            </div>

            <div className="text-muted-foreground">{t("summary.sizeLabel")}:</div>
            <div className="font-medium">{state.size} m²</div>

            <div className="text-muted-foreground">{t("summary.bedroomsLabel")}:</div>
            <div className="font-medium">
              {state.bedrooms === 4 ? tDetails("bedroomsCountMax") : state.bedrooms}
            </div>

            <div className="text-muted-foreground">{t("summary.bathroomsLabel")}:</div>
            <div className="font-medium">{state.bathrooms}</div>

            <div className="text-muted-foreground">{t("summary.energyClassLabel")}:</div>
            <div className="font-medium">{state.energyClass}</div>

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

      <div className="bg-blue-50 p-4 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Calculator className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">{t("calculationMethod.title")}</p>
            <p className="mt-1 text-blue-700">{t("calculationMethod.description")}</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg text-sm">
        <p className="font-medium text-amber-800">{t("importantInfo.title")}</p>
        <p className="mt-1 text-amber-700">{t("importantInfo.description1")}</p>
        <p className="mt-2 text-amber-700">{t("importantInfo.description2")}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4" /> {t("downloadPdfButton")}
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
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
