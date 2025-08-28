"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function CalculatorPage() {
  const currentLocale = useLocale();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [housingType, setHousingType] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [showRegionInfo, setShowRegionInfo] = useState(false);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setShowRegionInfo(true);
  };

  const handleContinue = () => {
    if (selectedRegion === "bruxelles") {
      // Rediriger vers le calculateur Bruxelles
      window.location.href = `/${currentLocale}/calculateur/bruxelles`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour à l'accueil</span>
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-red-600" />
              <span className="font-bold text-xl">Évaluation du loyer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Étape 1: Choix de la région */}
            {!selectedRegion && (
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                  Évaluez votre loyer
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                  Dans quelle région se situe votre logement ?
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div
                    className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-red-500"
                    onClick={() => handleRegionSelect("bruxelles")}
                  >
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-red-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Bruxelles</h3>
                      <p className="text-gray-600">Région de Bruxelles-Capitale</p>
                      <div className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Encadrement en vigueur
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-orange-500"
                    onClick={() => handleRegionSelect("wallonie")}
                  >
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Wallonie</h3>
                      <p className="text-gray-600">Région wallonne</p>
                      <div className="mt-4 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        Évaluation disponible
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-gray-400"
                    onClick={() => handleRegionSelect("flandres")}
                  >
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Flandres</h3>
                      <p className="text-gray-600">Région flamande</p>
                      <div className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        En cours d'évaluation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informations sur la région sélectionnée */}
            {showRegionInfo && (
              <div className="max-w-2xl mx-auto">
                {selectedRegion === "bruxelles" && (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                      <MapPin className="h-16 w-16 text-red-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Région de Bruxelles-Capitale
                      </h2>
                    </div>

                    <div className="space-y-6 text-left">
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-green-800 mb-2">
                              Encadrement des loyers en vigueur
                            </h3>
                            <p className="text-green-700 text-sm">
                              À Bruxelles, les loyers sont encadrés par une grille de
                              référence légale. Notre outil vous permet d'évaluer si votre
                              loyer respecte cette grille.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-blue-800 mb-2">
                              Vos données sont protégées
                            </h3>
                            <p className="text-blue-700 text-sm">
                              Toutes les informations que vous fournirez restent anonymes
                              et confidentielles. Elles ne seront utilisées que pour
                              calculer votre évaluation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        onClick={handleContinue}
                        className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 text-lg"
                      >
                        Continuer l'évaluation
                      </Button>
                    </div>
                  </div>
                )}

                {selectedRegion === "wallonie" && (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                      <MapPin className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Région wallonne
                      </h2>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg text-left">
                      <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-orange-800 mb-3">
                            Encadrement non encore appliqué
                          </h3>
                          <p className="text-orange-700 mb-4">
                            L'encadrement des loyers n'est pas encore en vigueur en
                            Wallonie, mais vous pouvez tout de même évaluer votre
                            situation pour vous préparer aux évolutions futures.
                          </p>
                          <p className="text-orange-700 text-sm">
                            Cette évaluation vous donnera une indication sur le caractère
                            équitable de votre loyer selon les standards en cours de
                            développement.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <Button className="bg-orange-600 text-white hover:bg-orange-700 px-8 py-3 text-lg w-full">
                        Continuer l'évaluation (indicative)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRegion("")}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 w-full"
                      >
                        Changer de région
                      </Button>
                    </div>
                  </div>
                )}

                {selectedRegion === "flandres" && (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                      <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Région flamande
                      </h2>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-lg text-left">
                      <div className="flex items-start">
                        <Info className="h-6 w-6 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-3">
                            Outil en cours d'évaluation
                          </h3>
                          <p className="text-gray-700 mb-4">
                            Nous travaillons actuellement sur l'adaptation de notre outil
                            pour la région flamande. Cette fonctionnalité sera bientôt
                            disponible.
                          </p>
                          <p className="text-gray-700 text-sm">
                            En attendant, vous pouvez nous contacter pour toute question
                            concernant votre situation locative.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <Link href={`/${currentLocale}/contact`}>
                        <Button className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-3 text-lg w-full">
                          Nous contacter
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRegion("")}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 w-full"
                      >
                        Changer de région
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
