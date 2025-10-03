"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Info, User, Home, Building } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useLocale } from "next-intl";
import { UnifiedCalculatorLayout } from "../../../components/layouts/unified-calculator-layout";

export default function BruxellesCalculatorPage() {
  const currentLocale = useLocale();
  const [currentStep, setCurrentStep] = useState<
    "filters" | "intro" | "calculator"
  >("filters");
  const [housingType, setHousingType] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [consent, setConsent] = useState(false);

  const handleHousingTypeSelect = (type: string) => {
    if (type === "ais" || type === "social") {
      // Afficher message que l'encadrement ne s'applique pas
      alert(
        "L'encadrement des loyers ne s'applique pas aux logements AIS ou logements sociaux.",
      );
      return;
    }
    setHousingType(type);
    setCurrentStep("intro");
  };

  const handleUserTypeSelect = (type: string) => {
    setUserType(type);
    if (type === "bailleur") {
      // Rediriger vers le parcours bailleur
      window.location.href = `/${currentLocale}/calculateur/bruxelles/bailleur`;
    } else if (type === "locataire") {
      // Redirect to first step of calculator
      window.location.href = `/${currentLocale}/calculateur/bruxelles/step/property-type`;
    }
  };

  if (currentStep === "filters") {
    return (
      <UnifiedCalculatorLayout
        title="Évaluation Bruxelles"
        backUrl={`/${currentLocale}/calculateur`}
        backText="Retour au choix de région"
        showProgress={true}
        currentStep={1}
        totalSteps={5}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Type de logement
            </h1>
            <p className="text-xl text-gray-600">
              Dans quel type de logement habitez-vous ou souhaitez-vous habiter
              ?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-green-500"
              onClick={() => handleHousingTypeSelect("prive")}
            >
              <div className="text-center">
                <Home className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Marché privé
                </h3>
                <p className="text-gray-600 text-sm">
                  Location directe avec un propriétaire privé
                </p>
                <div className="mt-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Encadrement applicable
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-red-500"
              onClick={() => handleHousingTypeSelect("ais")}
            >
              <div className="text-center">
                <Building className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Logement AIS
                </h3>
                <p className="text-gray-600 text-sm">
                  Agence Immobilière Sociale
                </p>
                <div className="mt-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Encadrement non applicable
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-red-500"
              onClick={() => handleHousingTypeSelect("social")}
            >
              <div className="text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Logement social
                </h3>
                <p className="text-gray-600 text-sm">
                  CPAS, SLSP ou autres organismes publics
                </p>
                <div className="mt-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Encadrement non applicable
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">
                  Information importante
                </h3>
                <p className="text-blue-700 text-sm">
                  L&apos;encadrement des loyers à Bruxelles ne s&apos;applique
                  qu&apos;aux logements du marché privé. Les logements sociaux
                  et AIS ont leurs propres régulations spécifiques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </UnifiedCalculatorLayout>
    );
  }

  if (currentStep === "intro") {
    return (
      <UnifiedCalculatorLayout
        title="Évaluation Bruxelles"
        onBack={() => setCurrentStep("filters")}
        backText="Retour"
        showProgress={true}
        currentStep={2}
        totalSteps={5}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Bienvenue dans l&apos;outil d&apos;évaluation
            </h1>
            <p className="text-xl text-gray-600">Qui êtes-vous ?</p>
          </div>

          <div className="space-y-8">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Vos données sont protégées
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    Cet outil vous aide à évaluer si votre loyer respecte
                    l&apos;encadrement légal. Toutes vos données restent
                    anonymes et confidentielles.
                  </p>
                  <label
                    htmlFor="consent"
                    className="flex items-start gap-3 cursor-pointer p-3 -m-3 rounded hover:bg-green-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-6 h-6 mt-0.5 flex-shrink-0 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-green-700 flex-1">
                      J&apos;accepte que mes données anonymisées soient
                      utilisées à des fins de recherche pour améliorer les
                      politiques de logement.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 ${
                  !consent
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-blue-500"
                }`}
                onClick={() => consent && handleUserTypeSelect("locataire")}
              >
                <div className="text-center">
                  <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Locataire
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Je loue ou souhaite louer un logement
                  </p>
                </div>
              </div>

              <div
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 ${
                  !consent
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-purple-500"
                }`}
                onClick={() => consent && handleUserTypeSelect("bailleur")}
              >
                <div className="text-center">
                  <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Bailleur
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Je loue ou souhaite louer mon bien
                  </p>
                </div>
              </div>

              <div
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 ${
                  !consent
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-gray-500"
                }`}
                onClick={() => consent && handleUserTypeSelect("autre")}
              >
                <div className="text-center">
                  <Info className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Autre
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Curieux, étudiant, professionnel...
                  </p>
                </div>
              </div>
            </div>

            {!consent && (
              <div className="text-center text-gray-500 text-sm">
                Veuillez accepter l&apos;utilisation des données pour continuer
              </div>
            )}
          </div>
        </div>
      </UnifiedCalculatorLayout>
    );
  }

  // This should not be reached anymore as we redirect to step-based routing
  return null;
}
