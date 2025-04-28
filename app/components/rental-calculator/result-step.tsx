"use client";

import { useForm } from "@/app/context/form-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download, Share2, Info, Calculator } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ResultStep() {
  const { state, dispatch } = useForm();

  const handleReset = () => {
    dispatch({ type: "RESET_FORM" });
  };
  const handleEdit = () => {
    dispatch({ type: "GO_TO_STEP", payload: 1 });
  };

  // Generates a dynamic formula string in French based on used constants and variables
  const getDynamicFormulaString = (): string => {
    const {
      propertyType,
      bedrooms,
      propertyState,
      energyClass,
      hasCentralHeating,
      hasThermalRegulation,
      hasSecondBathroom,
      hasRecreationalSpaces,
      hasStorageSpaces,
      numberOfGarages,
    } = state;

    // French labels for constants and terms
    const nameMap: Record<string, string> = {
      BASE_CONSTANT: "Constante de Base",
      MULTIPLIER: "Multiplicateur",
      STATE_2_ADJUSTMENT: "Ajustement État (Bon)",
      STATE_3_ADJUSTMENT: "Ajustement État (Excellent)",
      DIFFICULTY_MULTIPLIER: "Multiplicateur Difficulté",
      PEB_A_ADJUSTMENT: "Ajustement PEB A",
      PEB_B_ADJUSTMENT: "Ajustement PEB B",
      PEB_C_ADJUSTMENT: "Ajustement PEB C",
      PEB_D_ADJUSTMENT: "Ajustement PEB D",
      PEB_F_ADJUSTMENT: "Ajustement PEB F",
      PEB_G_ADJUSTMENT: "Ajustement PEB G",
      NO_CENTRAL_HEATING_ADJUSTMENT: "Ajustement Absence Chauffage Central",
      NO_THERMAL_REG_ADJUSTMENT: "Ajustement Absence Régulation Thermique",
      SECOND_BATHROOM_ADJUSTMENT: "Ajustement Présence 2ème Salle de Bain",
      NO_RECREATIONAL_SPACES_ADJUSTMENT: "Ajustement Absence Espaces Récréatifs",
      STORAGE_SPACES_ADJUSTMENT: "Ajustement Présence Espaces Rangement",
      GARAGE_ADJUSTMENT: "Ajustement Garage",
      surface: "Surface",
      difficultyIndex: "Indice Synth. de Difficulté",
    };

    // Helper for dynamic property type/bedroom constants in French
    const getPropertyConstantLabel = (
      type: string,
      beds: number,
      prefix: "FC" | "ISM"
    ): string => {
      const baseLabel =
        prefix === "FC" ? "Constante Formule" : "Multiplicateur Surface Inverse";
      let suffix = "";
      if (type === "studio" || (type === "apartment" && beds === 0)) {
        suffix = "(Studio)";
      } else if (type === "apartment") {
        suffix = `(Appt ${beds >= 4 ? "4+ Ch." : `${beds} Ch.`})`;
      } else if (type === "house") {
        suffix = `(Maison ${beds >= 4 ? "4+ Ch." : beds <= 2 ? "1-2 Ch." : "3 Ch."})`;
      }
      return `${baseLabel} ${suffix}`;
    };

    // Get French labels for dynamic constants
    const formulaConstantLabel = getPropertyConstantLabel(propertyType, bedrooms, "FC");
    const inverseSurfaceMultiplierLabel = getPropertyConstantLabel(
      propertyType,
      bedrooms,
      "ISM"
    );

    // Build the core formula part using French labels
    let coreFormula = `(${nameMap.BASE_CONSTANT} + ${nameMap.MULTIPLIER} * (${formulaConstantLabel} + ${inverseSurfaceMultiplierLabel} * 1/${nameMap.surface})`;

    // Add state adjustment if applicable
    const currentPropertyState = propertyState ?? 2;
    if (currentPropertyState === 2) {
      coreFormula += ` + ${nameMap.STATE_2_ADJUSTMENT}`;
    } else if (currentPropertyState === 3) {
      coreFormula += ` + ${nameMap.STATE_3_ADJUSTMENT}`;
    }

    // Add difficulty index part
    coreFormula += ` + ${nameMap.DIFFICULTY_MULTIPLIER} * ${nameMap.difficultyIndex}) * ${nameMap.surface}`;

    // Build the adjustments part using French labels
    let adjustments = "";
    const energyAdjustmentsMap: Partial<Record<typeof energyClass, string>> = {
      A: nameMap.PEB_A_ADJUSTMENT,
      B: nameMap.PEB_B_ADJUSTMENT,
      C: nameMap.PEB_C_ADJUSTMENT,
      D: nameMap.PEB_D_ADJUSTMENT,
      E: "", // No adjustment label needed for PEB E
      F: nameMap.PEB_F_ADJUSTMENT,
      G: nameMap.PEB_G_ADJUSTMENT,
    };
    if (
      energyClass &&
      energyClass in energyAdjustmentsMap &&
      energyAdjustmentsMap[energyClass]
    ) {
      adjustments += ` + ${energyAdjustmentsMap[energyClass]}`;
    }

    if (hasCentralHeating === false)
      adjustments += ` + ${nameMap.NO_CENTRAL_HEATING_ADJUSTMENT}`;
    if (hasThermalRegulation === false)
      adjustments += ` + ${nameMap.NO_THERMAL_REG_ADJUSTMENT}`;
    if (hasSecondBathroom === true)
      adjustments += ` + ${nameMap.SECOND_BATHROOM_ADJUSTMENT}`;
    if (hasRecreationalSpaces === false)
      adjustments += ` + ${nameMap.NO_RECREATIONAL_SPACES_ADJUSTMENT}`;
    if (hasStorageSpaces === true)
      adjustments += ` + ${nameMap.STORAGE_SPACES_ADJUSTMENT}`;
    if (numberOfGarages > 0)
      adjustments += ` + (${nameMap.GARAGE_ADJUSTMENT} * ${numberOfGarages})`;

    return `Loyer = ${coreFormula}${adjustments}`;
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    // Destructure ALL relevant state properties
    const {
      // Address
      streetNumber,
      streetName,
      postalCode,
      propertyType,
      size,
      bedrooms,
      propertyState,
      difficultyIndex,
      energyClass,
      hasCentralHeating,
      hasThermalRegulation,
      hasSecondBathroom,
      hasRecreationalSpaces,
      hasStorageSpaces,
      numberOfGarages,
      medianRent,
      minRent,
      maxRent,
      // Property Details
      bathrooms,
      // Energy & Heating
      heatingType, // Note: Only hasCentralHeating is used in formula
      hasDoubleGlazing, // Note: Not used in current formula, but good to show user input
      constructedBefore2000, // Note: Not used directly, but influences propertyState logic
    } = state;

    // --- Define Labels and Formatters ---
    const address = `${streetNumber} ${streetName}, ${postalCode} Bruxelles`;
    const propertyStateLabels: Record<number, string> = {
      1: "Mauvais état",
      2: "Bon état",
      3: "Excellent état",
    };
    const kitchenTypeLabels: Record<string, string> = {
      open: "Ouverte",
      closed: "Fermée",
      american: "Américaine",
      none: "Non spécifié",
    };
    const heatingTypeLabels: Record<string, string> = {
      central: "Central",
      individual: "Individuel",
      none: "Non spécifié",
    };
    const formatBoolean = (val: boolean | null): string => {
      if (val === null) return "Non spécifié";
      return val ? "Oui" : "Non";
    };
    const formatOptionalNumber = (val: number | null, unit: string = ""): string => {
      if (val === null || val === undefined) return "Non spécifié";
      return `${val}${unit}`;
    };

    // --- PDF Content ---
    doc.setFontSize(18);
    doc.text("Estimation Loyer Indicatif", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // --- User Inputs Table ---
    const userInputData = [
      // Address
      ["Adresse", address],
      // Property Details
      ["Type de bien", propertyTypeLabels[propertyType] || propertyType],
      ["Nombre de chambres", bedrooms >= 4 ? "4 et plus" : bedrooms.toString()], // Handle >= 4
      ["Surface", `${size} m²`],
      [
        "État du logement",
        propertyState
          ? propertyStateLabels[propertyState]
          : "Non spécifié (défaut: Bon état)",
      ],
      ["Construit avant 2000", formatBoolean(constructedBefore2000)],
      ["Salles de bain", bathrooms.toString()],
      ["Garage(s)", numberOfGarages.toString()], // Already included, keep for consistency
      // Energy & Heating
      ["Classe PEB", energyClass || "Non spécifié"],
      ["Type de chauffage", heatingTypeLabels[heatingType] || heatingType],
      ["Chauffage central", formatBoolean(hasCentralHeating)], // Already included
      ["Régulation thermique", formatBoolean(hasThermalRegulation)], // Already included
      ["Double vitrage", formatBoolean(hasDoubleGlazing)],
      // Other Features used in calculation
      ["2ème salle de bain", formatBoolean(hasSecondBathroom)], // Already included
      ["Espaces récréatifs", formatBoolean(hasRecreationalSpaces)], // Already included
      ["Espaces de rangement", formatBoolean(hasStorageSpaces)], // Already included
      // Calculation Inputs
      ["Indice synth. de difficulté", difficultyIndex?.toFixed(6) ?? "N/A"], // Already included
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Paramètre Entré", "Valeur"]],
      body: userInputData,
      theme: "grid",
      headStyles: { fillColor: [224, 92, 109] }, // Match button color
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          "Page " + doc.getNumberOfPages(), // Use direct method
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    let finalY = (doc as any).lastAutoTable.finalY || 100; // Get Y position after table

    // --- Constants Table (Dynamically Built) ---
    // --- Constants Table (Dynamically Built with French Labels) ---
    const nameMapForTable: Record<string, string> = {
      // Re-define or reuse from above if scope allows
      BASE_CONSTANT: "Constante de Base",
      MULTIPLIER: "Multiplicateur",
      STATE_2_ADJUSTMENT: "Ajustement État (Bon)",
      STATE_3_ADJUSTMENT: "Ajustement État (Excellent)",
      DIFFICULTY_MULTIPLIER: "Multiplicateur Difficulté",
      PEB_A_ADJUSTMENT: "Ajustement PEB A",
      PEB_B_ADJUSTMENT: "Ajustement PEB B",
      PEB_C_ADJUSTMENT: "Ajustement PEB C",
      PEB_D_ADJUSTMENT: "Ajustement PEB D",
      PEB_F_ADJUSTMENT: "Ajustement PEB F",
      PEB_G_ADJUSTMENT: "Ajustement PEB G",
      NO_CENTRAL_HEATING_ADJUSTMENT: "Ajustement Absence Chauffage Central",
      NO_THERMAL_REG_ADJUSTMENT: "Ajustement Absence Régulation Thermique",
      SECOND_BATHROOM_ADJUSTMENT: "Ajustement Présence 2ème Salle de Bain",
      NO_RECREATIONAL_SPACES_ADJUSTMENT: "Ajustement Absence Espaces Récréatifs",
      STORAGE_SPACES_ADJUSTMENT: "Ajustement Présence Espaces Rangement",
      GARAGE_ADJUSTMENT: "Ajustement Garage",
    };

    const activeConstantsData: (string | number)[][] = [
      [nameMapForTable.BASE_CONSTANT, "0.1758082"],
      [nameMapForTable.MULTIPLIER, "1.0207648"],
      [nameMapForTable.DIFFICULTY_MULTIPLIER, "-0.6455585"],
    ];

    // State Adjustment
    const currentPropertyState = propertyState ?? 2; // Use default if null
    if (currentPropertyState === 2) {
      activeConstantsData.push([nameMapForTable.STATE_2_ADJUSTMENT, "0.2490667"]);
    } else if (currentPropertyState === 3) {
      activeConstantsData.push([nameMapForTable.STATE_3_ADJUSTMENT, "1.042853"]);
    }
    // Note: State 1 has no adjustment value.

    // PEB Adjustment
    const energyAdjustments: Partial<Record<typeof energyClass, number>> = {
      A: 164.16,
      B: 109.44,
      C: 54.72,
      D: 21.89,
      E: 0,
      F: -10.94,
      G: -21.89,
    };
    if (energyClass && energyClass in energyAdjustments) {
      const adjustmentValue = energyAdjustments[energyClass];
      // Only add if adjustment value exists and is not 0 (or adjust condition if 0 should be shown)
      if (adjustmentValue !== undefined && adjustmentValue !== 0) {
        activeConstantsData.push([
          `Ajustement PEB ${energyClass}`,
          `${adjustmentValue > 0 ? "+" : ""}${adjustmentValue.toFixed(2)} €`,
        ]);
      } else if (adjustmentValue === 0) {
        // Optionally show PEB E explicitly if desired
        // activeConstantsData.push([`Ajustement PEB ${energyClass}`, `+0.00 €`]);
      }
    }

    // Other Adjustments (only add if the condition triggering the adjustment is met)
    if (hasCentralHeating === false) {
      activeConstantsData.push([
        nameMapForTable.NO_CENTRAL_HEATING_ADJUSTMENT,
        "-18.679544 €",
      ]);
    }
    if (hasThermalRegulation === false) {
      activeConstantsData.push([
        nameMapForTable.NO_THERMAL_REG_ADJUSTMENT,
        "-16.867348 €",
      ]);
    }
    if (hasSecondBathroom === true) {
      activeConstantsData.push([
        nameMapForTable.SECOND_BATHROOM_ADJUSTMENT,
        "+88.547325 €",
      ]);
    }
    if (hasRecreationalSpaces === false) {
      activeConstantsData.push([
        nameMapForTable.NO_RECREATIONAL_SPACES_ADJUSTMENT,
        "-15.763757 €",
      ]);
    }
    if (hasStorageSpaces === true) {
      activeConstantsData.push([
        nameMapForTable.STORAGE_SPACES_ADJUSTMENT,
        "+0.707585 €",
      ]);
    }
    if (numberOfGarages > 0) {
      const garageTotalAdj = numberOfGarages * 40.109301;
      activeConstantsData.push([
        `${nameMapForTable.GARAGE_ADJUSTMENT} (${numberOfGarages})`,
        `+${garageTotalAdj.toFixed(2)} €`,
      ]);
    }
    // Add other conditional adjustments here if any were missed

    autoTable(doc, {
      startY: finalY + 10,
      head: [["Constante / Ajustement Appliqué", "Valeur"]],
      body: activeConstantsData, // Use the dynamically built data
      theme: "grid",
      headStyles: { fillColor: [96, 165, 250] }, // Blue color
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          "Page " + doc.getNumberOfPages(),
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    finalY = (doc as any).lastAutoTable.finalY; // Update Y position

    // --- Applied Formula Section ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Formule Appliquée (pour ce bien):", 14, finalY + 15); // Ensure French header
    doc.setFontSize(9);
    doc.setTextColor(100);
    // Wrap the formula text
    const appliedFormulaLines = doc.splitTextToSize(
      getDynamicFormulaString(), // Use the new dynamic function
      180
    ); // 180mm width
    doc.text(appliedFormulaLines, 14, finalY + 20); // Increased spacing

    // --- Results Section ---
    finalY = finalY + 20 + appliedFormulaLines.length * 4; // Update Y after applied formula

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Résultats:", 14, finalY + 10); // Ensure French header
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Loyer Médian Estimé: ${medianRent} €`, 14, finalY + 15); // Ensure French label
    doc.text(
      `Fourchette Indicative (±10%): ${minRent} € - ${maxRent} €`, // Ensure French label
      14,
      finalY + 20
    );

    // --- Save ---
    doc.save(`estimation-loyer-${streetName.replace(/\s+/g, "-")}-${streetNumber}.pdf`);
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Appartement",
    house: "Maison",
    studio: "Studio",
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Résultat de l'estimation</h2>
        <p className="text-muted-foreground mt-2">
          Voici le loyer indicatif pour ce bien
        </p>
      </div>

      <Card className="bg-gradient-to-r from-[#f18240] to-[#e05c6d] text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium">Loyer mensuel estimé</p>
            <p className="text-5xl font-bold mt-2">{state.estimatedRent} €</p>
            <div className="flex justify-center items-center mt-2">
              <p className="text-sm opacity-80">
                Fourchette de prix: {state.minRent} € - {state.maxRent} €
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Selon la législation bruxelloise, le loyer de référence peut varier
                      de ±20%
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Récapitulatif du bien</h3>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Adresse</h4>
            <p>
              {state.streetNumber} {state.streetName}, {state.postalCode} Bruxelles
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Type de bien:</div>
            <div className="font-medium">
              {propertyTypeLabels[state.propertyType] || "-"}
            </div>

            <div className="text-muted-foreground">Adresse:</div>
            <div className="font-medium">
              {state.streetNumber} {state.streetName}, {state.postalCode} Bruxelles
            </div>

            <div className="text-muted-foreground">Surface:</div>
            <div className="font-medium">{state.size} m²</div>

            <div className="text-muted-foreground">Chambres:</div>
            <div className="font-medium">
              {state.bedrooms === 4 ? "4 et plus" : state.bedrooms}
            </div>

            <div className="text-muted-foreground">Salles de bain:</div>
            <div className="font-medium">{state.bathrooms}</div>

            <div className="text-muted-foreground">Classe énergétique:</div>
            <div className="font-medium">{state.energyClass}</div>

            <div className="text-muted-foreground">Équipements:</div>
            <div className="font-medium">
              {[
                state.hasCentralHeating ? "Chauffage central" : null,
                state.hasThermalRegulation ? "Régulation thermique" : null,
                state.hasDoubleGlazing ? "Double-vitrages" : null,
                state.hasSecondBathroom ? "2ème salle de bain" : null,
                state.hasRecreationalSpaces ? "Espaces récréatifs" : null,
                state.hasStorageSpaces ? "Espaces de rangement" : null,
              ]
                .filter(Boolean)
                .join(", ") || "Aucun"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Calculator className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Méthode de calcul</p>
            <p className="mt-1 text-blue-700">
              Le loyer de référence est calculé selon la formule officielle de la Région
              de Bruxelles-Capitale, qui prend en compte le type de bien, sa surface, le
              nombre de chambres, l'état du bien et l'indice de difficulté du quartier.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg text-sm">
        <p className="font-medium text-amber-800">Information importante</p>
        <p className="mt-1 text-amber-700">
          Le loyer de référence n'est pas contraignant. En dehors de cadres réglementaires
          particuliers, le montant du loyer est déterminé librement par le bailleur sur le
          marché privé.
        </p>
        <p className="mt-2 text-amber-700">
          Toutefois, le loyer de référence doit obligatoirement être mentionné en plus du
          loyer réel dans les baux d'habitation en Région de Bruxelles Capitale.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4" /> Télécharger PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" /> Partager
          </Button>
        </div>
        <Button onClick={handleEdit} className="bg-[#e05c6d] hover:bg-[#d04c5d] gap-2">
          Modifier l'estimation <ArrowRight className="h-4 w-4" />
        </Button>
        <Button onClick={handleReset} className="bg-[#e05c6d] hover:bg-[#d04c5d] gap-2">
          Nouvelle estimation <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
