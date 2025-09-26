'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocale } from 'next-intl';
import {
  GlobalFormProvider,
  useGlobalForm,
} from '../../../../context/global-form-context';

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
  const [currentSection, setCurrentSection] = useState(0);

  // Get pre-filled data from global context
  const existingRent = globalForm.getActualRent();
  const existingSpace = globalForm.getLivingSpace();
  const contactInfo = globalForm.getContactInfo();

  const [data, setData] = useState<QuestionnaireData>({
    leaseType: globalForm.state.rentalInfo.leaseType || '',
    leaseStartDate: globalForm.state.rentalInfo.leaseStartDate || '',
    monthlyIncome: globalForm.state.householdInfo.monthlyIncome || '',
    householdComposition: globalForm.state.householdInfo.householdComposition || '',
    rentIndexation: globalForm.state.rentalInfo.rentIndexation || '',
    paymentDelays: globalForm.state.householdInfo.paymentDelays || '',
    evictionThreats: globalForm.state.householdInfo.evictionThreats || '',
    mediationAttempts: globalForm.state.householdInfo.mediationAttempts || '',
    boilerMaintenance: globalForm.state.rentalInfo.boilerMaintenance,
    fireInsurance: globalForm.state.rentalInfo.fireInsurance,
    healthIssues: globalForm.state.propertyIssues.healthIssues || [],
    majorDefects: globalForm.state.propertyIssues.majorDefects || [],
    positiveAspects: globalForm.state.propertyIssues.positiveAspects || [],
    additionalComments: globalForm.state.propertyIssues.additionalComments || '',
  });

  // Update global context when data changes
  useEffect(() => {
    globalForm.updateRentalInfo({
      leaseType: data.leaseType,
      leaseStartDate: data.leaseStartDate,
      rentIndexation: data.rentIndexation,
      boilerMaintenance: data.boilerMaintenance,
      fireInsurance: data.fireInsurance,
    });

    globalForm.updateHouseholdInfo({
      monthlyIncome: data.monthlyIncome,
      householdComposition: data.householdComposition,
      paymentDelays: data.paymentDelays,
      evictionThreats: data.evictionThreats,
      mediationAttempts: data.mediationAttempts,
    });

    globalForm.updatePropertyIssues({
      healthIssues: data.healthIssues,
      majorDefects: data.majorDefects,
      positiveAspects: data.positiveAspects,
      additionalComments: data.additionalComments,
    });
  }, [data]);

  const sections = [
    'Informations récupérées',
    'Situation personnelle et du bail',
    'Problèmes du logement',
    'Points positifs du logement',
    'Résultat personnalisé',
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCheckboxChange = (
    field: keyof QuestionnaireData,
    value: string,
    checked: boolean
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }));
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Questionnaire détaillé
              </h2>
              <p className="text-gray-600">
                Nous utilisons les informations déjà collectées de votre évaluation
              </p>
            </div>

            {/* Show pre-filled data */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="font-semibold text-green-800 mb-3">
                ✓ Informations déjà collectées
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-medium">Loyer actuel :</span>
                  <span className="ml-2">
                    {existingRent ? `${existingRent}€/mois` : 'Non renseigné'}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Surface habitable :</span>
                  <span className="ml-2">
                    {existingSpace ? `${existingSpace}m²` : 'Non renseignée'}
                  </span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Email :</span>
                  <span className="ml-2">{contactInfo.email || 'Non renseigné'}</span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Téléphone :</span>
                  <span className="ml-2">{contactInfo.phone || 'Non renseigné'}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800">
                <Info className="h-4 w-4 inline mr-2" />
                Ce questionnaire approfondi nous permettra de mieux comprendre votre
                situation et de vous donner des conseils plus précis. Aucune donnée ne
                sera redemandée !
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Situation personnelle et du bail
              </h2>
              <p className="text-gray-600">
                Ces informations nous aident à mieux comprendre votre situation
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Type de bail</Label>
                <RadioGroup
                  value={data.leaseType}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, leaseType: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9-years" id="9-years" />
                    <label htmlFor="9-years">Bail de 9 ans (résidence principale)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-years" id="3-years" />
                    <label htmlFor="3-years">Bail de 3 ans</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-year" id="1-year" />
                    <label htmlFor="1-year">Bail de moins d'un an</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <label htmlFor="other">Autre</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="leaseStartDate">Date de début du bail</Label>
                <Input
                  id="leaseStartDate"
                  type="date"
                  value={data.leaseStartDate}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, leaseStartDate: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="monthlyIncome">
                  Revenu mensuel approximatif (optionnel)
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Ex: 2500"
                  value={data.monthlyIncome}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, monthlyIncome: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Composition du foyer</Label>
                <RadioGroup
                  value={data.householdComposition}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, householdComposition: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <label htmlFor="single">Personne seule</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="couple" id="couple" />
                    <label htmlFor="couple">Couple sans enfant</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family" id="family" />
                    <label htmlFor="family">Famille avec enfant(s)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shared" id="shared" />
                    <label htmlFor="shared">Colocation</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Votre loyer a-t-il été indexé récemment ?</Label>
                <RadioGroup
                  value={data.rentIndexation}
                  onValueChange={(value) =>
                    setData((prev) => ({ ...prev, rentIndexation: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-recent" id="yes-recent" />
                    <label htmlFor="yes-recent">Oui, dans les 12 derniers mois</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes-old" id="yes-old" />
                    <label htmlFor="yes-old">Oui, mais il y a plus d'un an</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <label htmlFor="no">Non, jamais</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="unknown" />
                    <label htmlFor="unknown">Je ne sais pas</label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="boilerMaintenance"
                    checked={data.boilerMaintenance}
                    onCheckedChange={(checked) =>
                      setData((prev) => ({
                        ...prev,
                        boilerMaintenance: checked as boolean,
                      }))
                    }
                  />
                  <label htmlFor="boilerMaintenance" className="text-sm">
                    J'effectue l'entretien annuel de la chaudière (si applicable)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fireInsurance"
                    checked={data.fireInsurance}
                    onCheckedChange={(checked) =>
                      setData((prev) => ({ ...prev, fireInsurance: checked as boolean }))
                    }
                  />
                  <label htmlFor="fireInsurance" className="text-sm">
                    J'ai une assurance incendie en cours de validité
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
                Problèmes éventuels du logement
              </h2>
              <p className="text-gray-600">
                Ces défauts peuvent justifier une réduction de loyer
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">
                  Problèmes de salubrité ou de santé
                </Label>
                <div className="space-y-2 mt-2">
                  {[
                    'Humidité excessive ou moisissures',
                    "Problèmes de chauffage ou d'isolation",
                    'Nuisances sonores importantes',
                    "Problèmes d'électricité ou de plomberie",
                    'Infestation (rats, cafards, etc.)',
                    'Absence de ventilation adéquate',
                  ].map((issue) => (
                    <div key={issue} className="flex items-center space-x-2">
                      <Checkbox
                        id={issue}
                        checked={data.healthIssues.includes(issue)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('healthIssues', issue, checked as boolean)
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
                  Défauts importants du logement
                </Label>
                <div className="space-y-2 mt-2">
                  {[
                    'Fenêtres ou portes défectueuses',
                    'Revêtements de sol en mauvais état',
                    'Peinture écaillée ou papier peint décollé',
                    'Équipements de cuisine défaillants',
                    'Problèmes de salle de bain (carrelage, robinetterie)',
                    'Éclairage insuffisant',
                    'Espaces de rangement insuffisants',
                  ].map((defect) => (
                    <div key={defect} className="flex items-center space-x-2">
                      <Checkbox
                        id={defect}
                        checked={data.majorDefects.includes(defect)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('majorDefects', defect, checked as boolean)
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
                Plus votre logement présente de défauts, plus vous aurez d'arguments pour
                négocier une baisse de loyer.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Points positifs du logement
              </h2>
              <p className="text-gray-600">
                Ces éléments peuvent justifier un loyer plus élevé
              </p>
            </div>

            <div>
              <Label className="text-lg font-semibold">Avantages et équipements</Label>
              <div className="space-y-2 mt-2">
                {[
                  'Logement récemment rénové',
                  'Balcon, terrasse ou jardin',
                  'Parking ou garage inclus',
                  "Ascenseur dans l'immeuble",
                  'Quartier très bien desservi',
                  'Vue exceptionnelle',
                  'Équipements haut de gamme',
                  'Isolation thermique excellente',
                  'Système de sécurité',
                  'Cave ou débarras inclus',
                ].map((aspect) => (
                  <div key={aspect} className="flex items-center space-x-2">
                    <Checkbox
                      id={aspect}
                      checked={data.positiveAspects.includes(aspect)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          'positiveAspects',
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
              <Label htmlFor="additionalComments">Commentaires supplémentaires</Label>
              <Textarea
                id="additionalComments"
                placeholder="Décrivez d'autres aspects particuliers de votre logement..."
                value={data.additionalComments}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, additionalComments: e.target.value }))
                }
                rows={4}
              />
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <p className="text-sm text-green-800">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Ces informations nous permettront de vous donner une évaluation complète
                et personnalisée.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Votre situation personnalisée
              </h2>
              <p className="text-gray-600">
                Voici notre évaluation basée sur vos réponses
              </p>
            </div>

            {/* Ici on afficherait le résultat personnalisé */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Rejoignez Wuune !
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Quel que soit le résultat, ensemble nous sommes plus forts pour défendre
                  vos droits.
                </p>
                <div className="space-y-4">
                  <Link href={`/${currentLocale}/contact`}>
                    <Button className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 w-full">
                      Rejoindre le collectif
                    </Button>
                  </Link>
                  <Link href={`/${currentLocale}/calculateur`}>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 w-full"
                    >
                      Faire une nouvelle évaluation
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
              <span>Retour</span>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="font-bold text-xl">Questionnaire détaillé</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              Étape {currentSection + 1} sur {sections.length}
            </span>
            <span>{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
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

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Button>

                {currentSection < sections.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                  >
                    Suivant
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Link href={`/${currentLocale}/contact`}>
                    <Button className="bg-red-600 text-white hover:bg-red-700">
                      Terminer
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
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
