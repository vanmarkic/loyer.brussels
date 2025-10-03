"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Info,
  FileText,
  Calculator,
  BookOpen,
  Handshake,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { useLocale } from "next-intl";

export default function BailleurPage() {
  const currentLocale = useLocale();
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");

  const handleQuickDiagnostic = () => {
    // Simulation d'un diagnostic rapide
    const risks = ["low", "medium", "high"];
    const randomRisk = risks[Math.floor(Math.random() * risks.length)];
    setRiskLevel(randomRisk);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${currentLocale}/calculateur/bruxelles`}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl">Espace Bailleur</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Informez-vous pour éviter les conflits
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Respectez l&apos;encadrement des loyers et maintenez de bonnes relations avec vos
              locataires
            </p>
          </div>
        </div>
      </section>

      {/* Message rassurant */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Un accompagnement bienveillant
                  </h3>
                  <p className="text-green-700">
                    Notre objectif n&apos;est pas de sanctionner, mais de vous aider à
                    comprendre et respecter la réglementation. Un loyer équitable est
                    bénéfique pour tous : il favorise la stabilité locative et réduit les
                    risques de conflits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outils principaux */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Vos outils
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Grille légale */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <FileText className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Grille légale des loyers
                </h3>
                <p className="text-gray-600 mb-4">
                  Consultez la grille officielle pour connaître les loyers de référence
                  selon les caractéristiques du bien.
                </p>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Consulter la grille
                </Button>
              </div>

              {/* Guide pratique */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Guide : &quot;Puis-je augmenter le loyer ?&quot;
                </h3>
                <p className="text-gray-600 mb-4">
                  Découvrez dans quelles conditions vous pouvez réviser le loyer et les
                  procédures à respecter.
                </p>
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  Lire le guide
                </Button>
              </div>

              {/* Diagnostic rapide */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <Calculator className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Diagnostic rapide
                </h3>
                <p className="text-gray-600 mb-4">
                  Évaluez rapidement le risque que votre loyer ne respecte pas
                  l&apos;encadrement.
                </p>
                <Button
                  onClick={handleQuickDiagnostic}
                  className="w-full bg-orange-600 text-white hover:bg-orange-700"
                >
                  Faire le diagnostic
                </Button>
              </div>
            </div>

            {/* Résultat du diagnostic */}
            {riskLevel && (
              <div className="mt-8 max-w-2xl mx-auto">
                {riskLevel === "low" && (
                  <Alert className="border-green-200 bg-green-50">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Risque faible :</strong> Votre loyer semble conforme à
                      l&apos;encadrement. Continuez à maintenir cette bonne pratique !
                    </AlertDescription>
                  </Alert>
                )}

                {riskLevel === "medium" && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Risque modéré :</strong> Votre loyer pourrait nécessiter un
                      ajustement. Nous recommandons une vérification approfondie avec la
                      grille officielle.
                    </AlertDescription>
                  </Alert>
                )}

                {riskLevel === "high" && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Risque élevé :</strong> Votre loyer semble dépasser les
                      seuils légaux. Contactez-nous pour un accompagnement personnalisé et
                      éviter d&apos;éventuels conflits.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setRiskLevel("")}
                    className="mr-4"
                  >
                    Refaire le test
                  </Button>
                  <Button className="bg-green-600 text-white hover:bg-green-700">
                    Obtenir de l&apos;aide
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ressources et conseils */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Ressources et conseils
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Bonnes pratiques
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Respecter les procédures légales pour toute révision</li>
                    <li>• Maintenir une communication transparente</li>
                    <li>• Documenter tous les échanges importants</li>
                    <li>• Effectuer les réparations nécessaires</li>
                    <li>• Se tenir informé des évolutions réglementaires</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Éviter les conflits
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Expliquer clairement le calcul du loyer</li>
                    <li>• Répondre rapidement aux demandes</li>
                    <li>• Proposer des solutions en cas de difficultés</li>
                    <li>• Respecter les délais légaux</li>
                    <li>• Privilégier le dialogue à la confrontation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <Handshake className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Médiation volontaire
                  </h3>
                  <p className="text-gray-600 mb-4">
                    En cas de désaccord avec votre locataire, optez pour la médiation.
                    C&apos;est souvent plus rapide et moins coûteux qu&apos;une procédure
                    judiciaire.
                  </p>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Contacter un médiateur
                  </Button>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <FileText className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Kit bail conforme
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Téléchargez notre modèle de bail qui respecte toutes les obligations
                    légales et protège vos intérêts.
                  </p>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Télécharger le kit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appel vers BADALA */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Pourquoi encadrer les loyers ?</h2>
            <p className="text-xl mb-8 leading-relaxed">
              L&apos;encadrement des loyers protège le marché locatif et assure une concurrence
              loyale. Il garantit des loyers équitables tout en préservant la rentabilité
              des investissements immobiliers.
            </p>
            <div className="bg-white/10 rounded-lg p-6 mb-8">
              <p className="text-lg">
                Pour en savoir plus sur les enjeux et bénéfices de l&apos;encadrement des
                loyers, consultez les travaux de BADALA (Base de Données des Loyers).
              </p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <ExternalLink className="h-5 w-5 mr-2" />
              Découvrir BADALA
            </Button>
          </div>
        </div>
      </section>

      {/* Contact et support */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Besoin d&apos;accompagnement ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Notre équipe est là pour vous conseiller et vous accompagner dans vos
              démarches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${currentLocale}/contact`}>
                <Button className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg">
                  Nous contacter
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
