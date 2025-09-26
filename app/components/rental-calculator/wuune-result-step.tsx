"use client";

import { useState, useEffect } from "react";
import { useForm } from "@/app/context/form-context";
import { useGlobalForm } from "@/app/context/global-form-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Heart,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Mail,
  Phone,
  Shield,
  FileText,
  ArrowRight,
} from "lucide-react";

export function WuuneResultStep() {
  const { state } = useForm();
  const globalForm = useGlobalForm();
  const currentLocale = useLocale();
  
  // Get existing data to avoid re-asking
  const existingRent = globalForm.getActualRent();
  const contactInfo = globalForm.getContactInfo();
  
  // Local state for new inputs only
  const [actualRent, setActualRent] = useState<string>(existingRent || "");
  const [email, setEmail] = useState<string>(contactInfo.email || "");
  const [phone, setPhone] = useState<string>(contactInfo.phone || "");
  const [joinNewsletter, setJoinNewsletter] = useState(globalForm.state.userProfile.joinNewsletter);
  const [joinAssembly, setJoinAssembly] = useState(globalForm.state.userProfile.joinAssembly);

  // Update global state when local values change
  useEffect(() => {
    globalForm.updateRentalInfo({ actualRent });
  }, [actualRent]);

  useEffect(() => {
    globalForm.updateUserProfile({ email, phone, joinNewsletter, joinAssembly });
  }, [email, phone, joinNewsletter, joinAssembly]);

  // Calculer la différence entre le loyer réel et le loyer de référence
  const rentDifference = actualRent
    ? parseFloat(actualRent) - (state.medianRent || 0)
    : 0;
  const rentDifferencePercentage = state.medianRent
    ? (rentDifference / state.medianRent) * 100
    : 0;

  // Déterminer le type de situation
  const getSituationType = () => {
    if (!actualRent) return "unknown";
    if (rentDifferencePercentage <= -5) return "below-grid"; // Loyer inférieur à la grille
    if (rentDifferencePercentage > 20) return "abusive"; // Loyer abusif (plus de 20% au-dessus)
    if (rentDifferencePercentage > 5) return "high-but-legal"; // Loyer élevé mais non abusif
    return "fair"; // Loyer équitable
  };

  const situationType = getSituationType();

  const getMessageForSituation = () => {
    switch (situationType) {
      case "below-grid":
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-600" />,
          title: "Félicitations ! Votre loyer est équitable",
          description:
            "Votre loyer est inférieur aux références légales. C'est une bonne nouvelle !",
          color: "green",
          action:
            "Rejoignez Wuune pour défendre un encadrement encore plus strict et protéger tous les locataires.",
        };
      case "fair":
        return {
          icon: <CheckCircle className="h-16 w-16 text-blue-600" />,
          title: "Votre loyer respecte l'encadrement",
          description:
            "Votre loyer est dans les normes légales établies par la Région bruxelloise.",
          color: "blue",
          action:
            "Rejoignez Wuune pour maintenir et améliorer cette protection légale pour tous.",
        };
      case "high-but-legal":
        return {
          icon: <TrendingUp className="h-16 w-16 text-orange-600" />,
          title: "Votre loyer est élevé mais légal",
          description:
            "Votre loyer dépasse légèrement les références mais reste dans les limites autorisées.",
          color: "orange",
          action:
            "Vous pourriez négocier une baisse en mettant en avant d'éventuels défauts du logement. Wuune peut vous accompagner dans cette démarche.",
        };
      case "abusive":
        return {
          icon: <AlertTriangle className="h-16 w-16 text-red-600" />,
          title: "⚠️ Votre loyer semble abusif !",
          description:
            "Votre loyer dépasse largement les références légales. Vous avez le droit de contester.",
          color: "red",
          action:
            "Rejoignez Wuune dès maintenant ! Nous vous aiderons à faire valoir vos droits et à obtenir une baisse de loyer.",
        };
      default:
        return {
          icon: <Heart className="h-16 w-16 text-gray-600" />,
          title: "Évaluez votre situation",
          description:
            "Entrez votre loyer actuel pour obtenir une analyse personnalisée.",
          color: "gray",
          action: "Rejoignez Wuune pour défendre vos droits de locataire.",
        };
    }
  };

  const message = getMessageForSituation();

  const handleJoinWuune = () => {
    // Logique d'adhésion ou redirection
    window.location.href = `/${currentLocale}/contact?join=true&situation=${situationType}`;
  };

  return (
    <div className="space-y-8">
      {/* Résultat principal */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Votre évaluation personnalisée
        </h2>
        <p className="text-gray-600">
          Découvrez si votre loyer respecte l'encadrement légal
        </p>
      </div>

      {/* Loyer de référence */}
      <Card className="bg-gradient-to-r from-red-600 to-red-500 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Loyer de référence légal</h3>
          <div className="text-6xl font-bold mb-2">{state.medianRent || "..."} €</div>
          <p className="text-sm opacity-90">
            Fourchette : {state.minRent || "N/A"} € - {state.maxRent || "N/A"} €/mois
          </p>
        </CardContent>
      </Card>

      {/* Saisie du loyer actuel */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Quel est votre loyer actuel ?</h3>
            {existingRent && (
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                ✓ Déjà renseigné
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="actual-rent">Loyer mensuel (hors charges)</Label>
              <Input
                id="actual-rent"
                type="number"
                placeholder={existingRent ? `Actuellement: ${existingRent}€` : "Ex: 850"}
                value={actualRent}
                onChange={(e) => setActualRent(e.target.value)}
                className="text-xl font-semibold"
              />
              {existingRent && !actualRent && (
                <p className="text-sm text-gray-600 mt-1">
                  Vous pouvez modifier ce montant si nécessaire
                </p>
              )}
            </div>

            {actualRent && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>Différence avec la référence :</span>
                  <span
                    className={`font-semibold ${
                      rentDifference > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {rentDifference > 0 ? "+" : ""}
                    {rentDifference.toFixed(0)} € (
                    {rentDifferencePercentage > 0 ? "+" : ""}
                    {rentDifferencePercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message personnalisé selon la situation */}
      {actualRent && (
        <Card className={`border-l-4 border-l-${message.color}-500`}>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {message.icon}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{message.title}</h3>
                <p className="text-lg text-gray-600 mb-4">{message.description}</p>
                <p className="text-gray-700">{message.action}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adhésion à Wuune */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Heart className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Rejoignez le collectif Wuune !
            </h3>
            <p className="text-lg text-gray-600">
              Ensemble, nous pouvons faire changer les choses et défendre le droit au
              logement.
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <Label htmlFor="email">
                Email {contactInfo.email && "(déjà renseigné)"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={contactInfo.email || "votre.email@exemple.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">
                Téléphone {contactInfo.phone && "(déjà renseigné)"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={contactInfo.phone || "0X XX XX XX XX"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={joinNewsletter}
                  onChange={(e) => setJoinNewsletter(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  Je souhaite recevoir la newsletter de Wuune
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="assembly"
                  checked={joinAssembly}
                  onChange={(e) => setJoinAssembly(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="assembly" className="text-sm text-gray-700">
                  Je veux participer aux assemblées locales
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleJoinWuune}
              className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 text-lg"
            >
              <Users className="h-5 w-5 mr-2" />
              Rejoindre Wuune
            </Button>
            <Link href={`/${currentLocale}/calculateur/bruxelles/questionnaire`}>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg"
              >
                <FileText className="h-5 w-5 mr-2" />
                Questionnaire détaillé
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Actions supplémentaires */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-10 w-10 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Télécharger le rapport</h4>
            <p className="text-sm text-gray-600 mb-4">
              Obtenez un PDF détaillé de votre évaluation
            </p>
            <Button variant="outline" className="w-full">
              Télécharger
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Connaître mes droits</h4>
            <p className="text-sm text-gray-600 mb-4">
              Découvrez vos droits en tant que locataire
            </p>
            <Link href={`/${currentLocale}/wuune`}>
              <Button variant="outline" className="w-full">
                En savoir plus
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Heart className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Partager l'outil</h4>
            <p className="text-sm text-gray-600 mb-4">
              Aidez d'autres locataires à connaître leurs droits
            </p>
            <Button variant="outline" className="w-full">
              Partager
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Message de confidentialité */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-blue-800">
          <Shield className="h-4 w-4 inline mr-2" />
          Vos données restent anonymes et confidentielles. Elles ne seront jamais
          transmises à des tiers sans votre consentement explicite.
        </p>
      </div>
    </div>
  );
}
