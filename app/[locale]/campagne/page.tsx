"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ArrowLeft,
  Target,
  Users,
  Megaphone,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function CampagnePage() {
  const currentLocale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour à l&apos;accueil</span>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="font-bold text-xl">WUUNE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rejoins notre campagne
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              Ensemble contre les loyers abusifs : pour un logement décent et accessible à
              tous
            </p>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Le constat alarmant
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Des loyers en explosion
                </h3>
                <p className="text-gray-600">
                  À Bruxelles, les loyers ont augmenté de plus de 30% en 10 ans, bien
                  au-delà de l&apos;inflation et des revenus des ménages.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <TrendingUp className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Pratiques abusives
                </h3>
                <p className="text-gray-600">
                  Nombreux sont les propriétaires qui profitent de la pénurie de logements
                  pour imposer des loyers disproportionnés.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-red-800 mb-3">
                La réalité des chiffres
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • Plus de 40% des Bruxellois consacrent plus de 30% de leurs revenus au
                  logement
                </li>
                <li>
                  • 1 locataire sur 3 a déjà renoncé à contester un loyer abusif par peur
                  ou méconnaissance
                </li>
                <li>
                  • Les jeunes et les familles monoparentales sont particulièrement
                  touchés
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nos objectifs */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nos objectifs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Encadrement renforcé
              </h3>
              <p className="text-gray-600">
                Obtenir un encadrement plus strict des loyers avec des sanctions
                dissuasives pour les contrevenants.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Information massive</h3>
              <p className="text-gray-600">
                Informer massivement les locataires de leurs droits et les accompagner
                dans leurs démarches.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Megaphone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Mobilisation citoyenne
              </h3>
              <p className="text-gray-600">
                Créer un mouvement citoyen fort capable d&apos;influencer les politiques
                publiques de logement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos actions concrètes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Nos actions concrètes
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start bg-white rounded-lg shadow-md p-6">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Plateforme d&apos;évaluation des loyers
                  </h3>
                  <p className="text-gray-600">
                    Développement d&apos;un outil en ligne permettant à chaque locataire
                    d&apos;évaluer facilement si son loyer respecte les grilles légales.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white rounded-lg shadow-md p-6">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Permanences juridiques
                  </h3>
                  <p className="text-gray-600">
                    Organisation de permanences gratuites avec des juristes spécialisés
                    pour conseiller et accompagner les locataires.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white rounded-lg shadow-md p-6">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Campagnes de sensibilisation
                  </h3>
                  <p className="text-gray-600">
                    Diffusion d&apos;informations dans les quartiers, sur les réseaux sociaux
                    et dans les médias pour alerter sur les droits des locataires.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white rounded-lg shadow-md p-6">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Actions de protestation
                  </h3>
                  <p className="text-gray-600">
                    Manifestations pacifiques et actions symboliques pour maintenir la
                    pression sur les autorités compétentes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white rounded-lg shadow-md p-6">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Plaidoyer politique
                  </h3>
                  <p className="text-gray-600">
                    Rencontres avec les élus, participation aux consultations publiques et
                    propositions d&apos;amélioration de la législation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment participer */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Comment participer ?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Rejoins le mouvement</h3>
                <ul className="space-y-3 text-white/90">
                  <li>• Inscris-toi à notre newsletter pour rester informé(e)</li>
                  <li>• Participe à nos assemblées locales</li>
                  <li>• Rejoins nos groupes de travail thématiques</li>
                  <li>• Aide à la diffusion de nos messages</li>
                  <li>• Participe à nos actions et manifestations</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Témoigne et aide</h3>
                <ul className="space-y-3 text-white/90">
                  <li>• Partage ton expérience de locataire</li>
                  <li>• Signale les loyers abusifs dont tu as connaissance</li>
                  <li>• Aide d&apos;autres locataires dans leurs démarches</li>
                  <li>• Contribue financièrement selon tes moyens</li>
                  <li>• Utilise tes compétences pour nous soutenir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action final */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ensemble, nous pouvons gagner !
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Chaque voix compte, chaque action fait la différence. Rejoins-nous dès
            maintenant dans cette lutte pour un logement décent et accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${currentLocale}/contact`}>
              <Button className="bg-red-600 text-white hover:bg-red-700 px-8 py-3 text-lg">
                Rejoindre maintenant
              </Button>
            </Link>
            <Link href={`/${currentLocale}/calculateur`}>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg"
              >
                Évaluer mon loyer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
